use serde::{ser::Serializer, Deserialize, Serialize};
use serde_json::Value as JsonValue;
use sqlx::{migrate::MigrateDatabase, Column, Pool, Row};
use tauri::{
    command,
    plugin::{Builder as PluginBuilder, TauriPlugin},
    AppHandle, Manager, RunEvent, Runtime, State,
};
use tokio::sync::Mutex;

use std::collections::HashMap;
use std::{fs::create_dir_all, path::PathBuf};

// TODO part of vss, replace with sqlite-vec once it is out
// use std::{collections::HashMap, ffi::c_char};
// use libsqlite3_sys::{sqlite3, sqlite3_api_routines};
// use sqlite_vss::{sqlite3_vector_init, sqlite3_vss_init};

use super::decode;

type Db = sqlx::sqlite::Sqlite;

type LastInsertId = i64;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Sql(#[from] sqlx::Error),
    #[error(transparent)]
    Migration(#[from] sqlx::migrate::MigrateError),
    #[error("database {0} not loaded")]
    DatabaseNotLoaded(String),
    #[error("unsupported datatype: {0}")]
    UnsupportedDatatype(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type Result<T> = std::result::Result<T, Error>;

/// Resolves the App's **file path** from the `AppHandle` context
/// object
fn app_path<R: Runtime>(app: &AppHandle<R>) -> PathBuf {
    #[allow(deprecated)] // FIXME: Change to non-deprecated function in Tauri v2
    app.path_resolver()
        .app_dir()
        .expect("No App path was found!")
}

/// Maps the user supplied DB connection string to a connection string
/// with a fully qualified file path to the App's designed "app_path"
fn path_mapper(mut app_path: PathBuf, connection_string: &str) -> String {
    app_path.push(
        connection_string
            .split_once(':')
            .expect("Couldn't parse the connection string for DB!")
            .1,
    );

    format!(
        "sqlite:{}",
        app_path
            .to_str()
            .expect("Problem creating fully qualified path to Database file!")
    )
}

#[derive(Default)]
struct DbInstances(Mutex<HashMap<String, Pool<Db>>>);

#[derive(Default, Deserialize)]
pub struct PluginConfig {
    #[serde(default)]
    preload: Vec<String>,
}

#[command]
async fn load<R: Runtime>(
    #[allow(unused_variables)] app: AppHandle<R>,
    db_instances: State<'_, DbInstances>,
    db: String,
) -> Result<String> {
    let fqdb = path_mapper(app_path(&app), &db);

    create_dir_all(app_path(&app)).expect("Problem creating App directory!");

    if !Db::database_exists(&fqdb).await.unwrap_or(false) {
        Db::create_database(&fqdb).await?;
    }
    let pool = Pool::connect(&fqdb).await?;

    db_instances.0.lock().await.insert(db.clone(), pool);

    Ok(db)
}

/// Allows the database connection(s) to be closed; if no database
/// name is passed in then _all_ database connection pools will be
/// shut down.
#[command]
async fn close(db_instances: State<'_, DbInstances>, db: Option<String>) -> Result<bool> {
    let mut instances = db_instances.0.lock().await;

    let pools = if let Some(db) = db {
        vec![db]
    } else {
        instances.keys().cloned().collect()
    };

    for pool in pools {
        let db = instances
            .get_mut(&pool) //
            .ok_or(Error::DatabaseNotLoaded(pool))?;
        db.close().await;
    }

    Ok(true)
}

/// Execute a command against the database
#[command]
async fn execute(
    db_instances: State<'_, DbInstances>,
    db: String,
    query: String,
    values: Vec<JsonValue>,
) -> Result<(u64, LastInsertId)> {
    let mut instances = db_instances.0.lock().await;

    let db = instances.get_mut(&db).ok_or(Error::DatabaseNotLoaded(db))?;
    let mut query = sqlx::query(&query);
    for value in values {
        if value.is_null() {
            query = query.bind(None::<JsonValue>);
        } else if value.is_string() {
            query = query.bind(value.as_str().unwrap().to_owned())
        } else {
            query = query.bind(value);
        }
    }
    let result = query.execute(&*db).await?;
    let r = Ok((result.rows_affected(), result.last_insert_rowid()));
    r
}

#[command]
async fn select(
    db_instances: State<'_, DbInstances>,
    db: String,
    query: String,
    values: Vec<JsonValue>,
) -> Result<Vec<HashMap<String, JsonValue>>> {
    let mut instances = db_instances.0.lock().await;
    let db = instances.get_mut(&db).ok_or(Error::DatabaseNotLoaded(db))?;
    let mut query = sqlx::query(&query);
    for value in values {
        if value.is_null() {
            query = query.bind(None::<JsonValue>);
        } else if value.is_string() {
            query = query.bind(value.as_str().unwrap().to_owned())
        } else {
            query = query.bind(value);
        }
    }
    let rows = query.fetch_all(&*db).await?;
    let mut values = Vec::new();
    for row in rows {
        let mut value = HashMap::default();
        for (i, column) in row.columns().iter().enumerate() {
            let v = row.try_get_raw(i)?;
            let v = decode::to_json(v)?;

            value.insert(column.name().to_string(), v);
        }

        values.push(value);
    }

    Ok(values)
}

/// Tauri SQL plugin builder.
#[derive(Default)]
pub struct Builder {}

impl Builder {
    pub fn build<R: Runtime>(self) -> TauriPlugin<R, Option<PluginConfig>> {
        // Create an auto extension for the VSS functions
        // Everytime a new connection is created, the VSS functions will be loaded
        // unsafe {
        //     let vss_vector_init = sqlite3_vector_init as *const ();
        //     let vss_vector_init_correct: extern "C" fn(
        //         db: *mut sqlite3,
        //         pzErrMsg: *mut *const c_char,
        //         pThunk: *const sqlite3_api_routines,
        //     ) -> i32 = std::mem::transmute(vss_vector_init);
        //     libsqlite3_sys::sqlite3_auto_extension(Some(vss_vector_init_correct));

        //     let vss_init = sqlite3_vss_init as *const ();
        //     let vss_init_correct: extern "C" fn(
        //         db: *mut sqlite3,
        //         pzErrMsg: *mut *const c_char,
        //         pThunk: *const sqlite3_api_routines,
        //     ) -> i32 = std::mem::transmute(vss_init);
        //     libsqlite3_sys::sqlite3_auto_extension(Some(vss_init_correct));
        // }

        PluginBuilder::new("sql")
            .invoke_handler(tauri::generate_handler![load, execute, select, close])
            .setup_with_config(|app, config: Option<PluginConfig>| {
                let config = config.unwrap_or_default();

                create_dir_all(app_path(app)).expect("problems creating App directory!");

                tauri::async_runtime::block_on(async move {
                    let instances = DbInstances::default();
                    let mut lock = instances.0.lock().await;
                    for db in config.preload {
                        let fqdb = path_mapper(app_path(app), &db);

                        if !Db::database_exists(&fqdb).await.unwrap_or(false) {
                            Db::create_database(&fqdb).await?;
                        }
                        let pool = Pool::connect(&fqdb).await?;

                        lock.insert(db, pool);
                    }
                    drop(lock);

                    app.manage(instances);

                    Ok(())
                })
            })
            .on_event(|app, event| {
                if let RunEvent::Exit = event {
                    tauri::async_runtime::block_on(async move {
                        let instances = &*app.state::<DbInstances>();
                        let instances = instances.0.lock().await;
                        for value in instances.values() {
                            value.close().await;
                        }
                    });
                }
            })
            .build()
    }
}
