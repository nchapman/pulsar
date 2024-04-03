use std::{collections::HashMap, sync::Arc};

use nebula::options::{ContextOptions, ModelOptions};
use tauri::{
    async_runtime::Mutex,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State,
};

use serde::{Serialize, Serializer};
use base64::prelude::*;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("{0}")]
    ModelExist(String),
    #[error("{0}")]
    ModelNotExist(String),
    #[error("{0}")]
    ModelContextNotExist(String),
    #[error("{0}")]
    ModelNotInitialized(String),
    #[error("{0}")]
    Custom(String),
    #[error("{0}")]
    Nebula(#[from] nebula::error::Error),
    #[error("{0}")]
    Base64(#[from] base64::DecodeError)
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type Result<T> = std::result::Result<T, Error>;

struct NebulaModelState {
    model: Arc<Mutex<nebula::Model>>,
    contexts: HashMap<String, Arc<Mutex<nebula::Context>>>,
}

#[derive(Default)]
struct NebulaState {
    models: Arc<Mutex<HashMap<String, NebulaModelState>>>,
}

#[tauri::command]
async fn init_model<R: Runtime>(
    model_path: String,
    model_options: ModelOptions,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<String> {
    if let Some(_) = state.models.lock().await.get(&model_path) {
        Err(Error::ModelExist(model_path))
    } else {
        state.models.lock().await.insert(
            model_path.clone(),
            NebulaModelState {
                model: Arc::new(Mutex::new(nebula::Model::new(model_path.clone(), model_options)?)),
                contexts: HashMap::new(),
            },
        );
        Ok(model_path.clone())
    }
}

#[tauri::command]
async fn init_model_with_mmproj<R: Runtime>(
    model_path: String,
    mmproj_path: String,
    model_options: ModelOptions,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<String> {
    if let Some(_) = state.models.lock().await.get(&model_path) {
        Err(Error::ModelExist(model_path))
    } else {
        state.models.lock().await.insert(
            model_path.clone(),
            NebulaModelState {
                model: Arc::new(Mutex::new(nebula::Model::new_with_mmproj(model_path.clone(), mmproj_path.clone(), model_options)?)),
                contexts: HashMap::new(),
            },
        );
        Ok(model_path.clone()+&mmproj_path)
    }
}

#[tauri::command]
async fn drop_model<R: Runtime>(
    model: String,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<()> {
    if let None = state.models.lock().await.remove(&model) {
        Err(Error::ModelNotExist(model))
    } else {
        Ok(())
    }
}

#[tauri::command]
async fn model_init_context<R: Runtime>(
    model: String,
    context_options: ContextOptions,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<String> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        let context_name = uuid::Uuid::new_v4().to_string();
        mm.contexts.insert(context_name.clone(), Arc::new(Mutex::new(mm.model.lock().await.context(context_options)?)));
        Ok(context_name)
    } else {
        Err(Error::ModelNotExist(model))
    }
}

#[tauri::command]
async fn model_drop_context<R: Runtime>(
    model: String,
    context: String,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<()> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        if let None = mm.contexts.remove(&context){
            Err(Error::ModelContextNotExist(context))
        } else {
            Ok(())
        }
    } else {
        Err(Error::ModelNotExist(model))
    }
}

#[tauri::command]
async fn model_context_eval_string<R: Runtime>(
    model: String,
    context: String,
    data: String,
    use_bos: bool,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<()> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        if let Some(cc) = mm.contexts.get_mut(&context){
            cc.lock().await.eval_str(&data, use_bos)?;
            Ok(())
        } else {
            Err(Error::ModelContextNotExist(context))
        }
    } else {
        Err(Error::ModelNotExist(model))
    }
}

#[tauri::command]
async fn model_context_eval_image<R: Runtime>(
    model: String,
    context: String,
    base64_encoded_image: String,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<()> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        if let Some(cc) = mm.contexts.get_mut(&context){
            cc.lock().await.eval_image(BASE64_STANDARD.decode(base64_encoded_image)?)?;
            Ok(())
        } else {
            Err(Error::ModelContextNotExist(context))
        }
    } else {
        Err(Error::ModelNotExist(model))
    }
}

#[tauri::command]
async fn model_context_predict<R: Runtime>(
    model: String,
    context: String,
    max_len: usize,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> Result<String> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        if let Some(cc) = mm.contexts.get_mut(&context){
            let st = cc.lock().await.predict(max_len)?;
            Ok(st)
        } else {
            Err(Error::ModelContextNotExist(context))
        }
    } else {
        Err(Error::ModelNotExist(model))
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("nebula")
        .invoke_handler(tauri::generate_handler![init_model])
        .invoke_handler(tauri::generate_handler![init_model_with_mmproj])
        .invoke_handler(tauri::generate_handler![drop_model])
        .invoke_handler(tauri::generate_handler![model_init_context])
        .invoke_handler(tauri::generate_handler![model_drop_context])
        .invoke_handler(tauri::generate_handler![model_context_eval_string])
        .invoke_handler(tauri::generate_handler![model_context_eval_image])
        .invoke_handler(tauri::generate_handler![model_context_predict])
        .setup(|app_handle| {
            app_handle.manage(NebulaState::default());
            Ok(())
        })
        .build()
}
