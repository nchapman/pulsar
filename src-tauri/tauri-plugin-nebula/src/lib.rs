pub mod error;
use error::Error;
use std::{collections::HashMap, sync::Arc};

use nebula::options::{ContextOptions, ModelOptions};
use tauri::{
    async_runtime::Mutex,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State, Window,
};

use serde::{Serialize, Serializer};
use base64::prelude::*;

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
    if state.models.lock().await.contains_key(&model_path) {
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
    if state.models.lock().await.contains_key(&model_path) {
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

#[derive(serde::Serialize, Clone)]
struct PredictPayload{
    model: String,
    context: String,
    token: String,
    finished: bool
}

#[derive(serde::Serialize, Clone)]
struct FinishPayload{
    model: String,
    context: String,
    finished: bool
}

#[tauri::command]
async fn model_context_predict<R: Runtime>(
    model: String,
    context: String,
    max_len: usize,
    app: AppHandle<R>,
//    window: Window<R>,
    state: State<'_, NebulaState>,
) -> Result<()> {
    if let Some(mm) = state.models.lock().await.get_mut(&model) {
        if let Some(cc) = mm.contexts.get_mut(&context){
            let aapp = app.clone();
            let mmodel = model.clone();
            let ccontext = context.clone();
            cc.lock().await.predict_with_callback(Box::new(move |token|{
                app.emit_all("nebula-predict", PredictPayload{ model: model.clone(), context: context.clone(), token: token.to_string(), finished: false} ).unwrap();
                true
            }),
                                                  max_len)?;
            aapp.emit_all("nebula-predict", FinishPayload{ model: mmodel.clone(), context: ccontext.clone(), finished: true} ).unwrap();
            Ok(())
        } else {
            Err(Error::ModelContextNotExist(context))
        }
    } else {
        Err(Error::ModelNotExist(model))
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("nebula")
        .invoke_handler(tauri::generate_handler![init_model, init_model_with_mmproj, drop_model, model_init_context, model_drop_context, model_context_eval_string, model_context_eval_image, model_context_predict])
        .setup(|app_handle| {
            app_handle.manage(NebulaState::default());
            Ok(())
        })
        .build()
}