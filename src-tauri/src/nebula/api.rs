#[cfg(test)]
mod tests;

use crate::nebula::error::NebulaError;
use crate::nebula::error::NebulaResult;
use nebula::options::Message;
use nebula::options::PredictOptions;
use nebula::options::{ContextOptions, ModelOptions};
use serde::Serialize;
// use std::net::IpAddr;
use std::{
    collections::HashMap,
    sync::{atomic::AtomicBool, Arc},
};
use tauri::{
    async_runtime::Mutex,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime, State, Window,
};

struct NebulaModelState {
    model: Arc<Mutex<nebula::Model>>,
    contexts: HashMap<String, (Arc<Mutex<nebula::Context>>, Arc<AtomicBool>)>,
}

struct NebulaState {
    models: HashMap<String, NebulaModelState>,
    // server: Option<nebula::Server>,
}

impl Default for NebulaState {
    fn default() -> Self {
        Self {
            models: HashMap::new(),
            // server: None,
        }
    }
}

#[derive(Clone, Serialize)]
struct LoadProgressPayload {
    model: String,
    progress: f32,
}

/// get all loaded models
/// Even though the app currently only supports loading one model at the time
/// this function is useful for debugging and future proofing
#[tauri::command]
async fn get_loaded_models(
    state: State<'_, Mutex<NebulaState>>,
) -> Result<Vec<String>, NebulaError> {
    let state = state.lock().await;
    let loaded_models: Vec<String> = state.models.keys().cloned().collect();
    Ok(loaded_models)
}

/// initialize a model, loading it from disk and creating a new state
/// if the model is already loaded, it will return the existing path and nothing will be created
///
/// * - `model_path` - full disk path of model file
/// * - `model_options` - Options for model creations
///
#[tauri::command]
async fn init_model<R: Runtime>(
    window: Window<R>,
    model_path: String,
    model_options: ModelOptions,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<String> {
    let mut state = state.lock().await;

    if state.models.contains_key(&model_path) {
        return Ok(model_path.clone());
    }

    let cloned_path = model_path.clone();

    let mut last_emitted_value = 0.0;

    let model =
        nebula::Model::new_with_progress_callback(model_path.clone(), model_options, move |a| {
            if a != 1.0 && a - last_emitted_value < 0.1 {
                return true;
            }

            last_emitted_value = a;

            let _ = window.emit(
                "nebula://load-progress",
                LoadProgressPayload {
                    model: cloned_path.clone(),
                    progress: a,
                },
            );

            true
        })?;

    state.models.insert(
        model_path.clone(),
        NebulaModelState {
            model: Arc::new(Mutex::new(model.clone())),
            contexts: HashMap::new(),
        },
    );

    // let ctx_options = ContextOptions::default();

    // let server_instance = nebula::Server::new(
    //     "0.0.0.0".parse::<IpAddr>().expect("parse failed"),
    //     current_http_port.clone().try_into().unwrap(),
    //     model,
    //     ctx_options,
    // );

    // *server = Some(server_instance);

    // server_instance.run().await?;

    // log::info!("Server started on port: {}", current_http_port);

    // *current_http_port += 1;

    Ok(model_path.clone())
}

/// initialize model with multi modal projector.
///
/// * - `model_path` - path of model file
/// * - `mmproj_path` - path to projector file
/// * - `model_options` - Options for model creations
///
#[tauri::command]
async fn init_model_with_mmproj<R: Runtime>(
    window: Window<R>,
    model_path: String,
    mmproj_path: String,
    model_options: ModelOptions,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<String> {
    let mut state = state.lock().await;

    if state.models.contains_key(&model_path) {
        return Ok(model_path.clone());
    }

    let cloned_path = model_path.clone();

    let mut last_emitted_value = 0.0;

    let model = nebula::Model::new_with_mmproj_with_callback(
        model_path.clone(),
        mmproj_path.clone(),
        model_options,
        move |a| {
            if a != 1.0 && a - last_emitted_value < 0.1 {
                return true;
            }

            last_emitted_value = a;

            let _ = window.emit(
                "nebula://load-progress",
                LoadProgressPayload {
                    model: cloned_path.clone(),
                    progress: a,
                },
            );
            true
        },
    )?;

    let model_state = NebulaModelState {
        model: Arc::new(Mutex::new(model.clone())),
        contexts: HashMap::new(),
    };

    state.models.insert(model_path.clone(), model_state);

    // let ctx_options = ContextOptions::default();

    // let server = nebula::Server::new(
    //     "0.0.0.0".parse::<IpAddr>().expect("parse failed"),
    //     current_http_port.clone().try_into().unwrap(),
    //     model,
    //     ctx_options,
    // );

    // servers.insert(model_path.clone(), server);

    // servers.get(&model_path).unwrap().run()?;

    // log::info!("Server started on port: {}", current_http_port);

    // *current_http_port += 1;

    Ok(model_path.clone() + &mmproj_path)
}

/// drop model from memory
///
/// * - `model_path` - model path passed to `init_model` or `init_model_with_mmproj`
///
#[tauri::command]
async fn drop_model<R: Runtime>(
    model_path: String,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<()> {
    let mut state = state.lock().await;

    state
        .models
        .remove(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    // servers
    //     .remove(&model_path)
    //     .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    Ok(())
}

/// initialize context for an initialized model.
///
/// * - `model_path` - model_path used in `init_model` or `init_model_with_mmproj`
/// * - `context_option` - Set of options for context creation, should contain a message map
///
#[tauri::command]
async fn model_init_context<R: Runtime>(
    model_path: String,
    context_options: ContextOptions,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<String> {
    let mut state = state.lock().await;

    let model = state
        .models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    let context_id = uuid::Uuid::new_v4().to_string();

    model.contexts.insert(
        context_id.clone(),
        (
            Arc::new(Mutex::new(
                model.model.lock().await.context(context_options)?,
            )),
            Arc::new(AtomicBool::new(false)),
        ),
    );

    Ok(context_id)
}

/// drop context.
///
/// * - `model` - model creted by `init_model` or
/// `init_model_with_mmproj`
/// * - `context` - context created with `model_init_context`
///
#[tauri::command]
async fn model_drop_context<R: Runtime>(
    model_path: String,
    context_id: String,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<()> {
    let mut state = state.lock().await;
    let model = state
        .models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    model.contexts.remove(&context_id);

    Ok(())
}

/// The event payload for the `nebula-predict` event that gets sent to the JS frontend.
/// Do not change this struct without also changing the corresponding JS code.
/// Do not create multiple with variations as things will get out of sync and everything will need to be updated at the same time
#[derive(serde::Serialize, Clone)]
struct PredictPayload {
    model: String,
    context: String,
    token: Option<String>,
    finished: bool,
}

/// evaluate dialog to context.
///
/// * - `model_path` - model created by `init_model` or
/// `init_model_with_mmproj`
/// * - `context` - context created with `model_init_context`
/// * - `dialog` - dialog for evaluating
#[tauri::command]
async fn model_context_eval<R: Runtime>(
    model_path: String,
    context_id: String,
    dialog: Vec<Message>,
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<()> {
    let mut state = state.lock().await;

    let model = state
        .models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    let (cc, ss) = model
        .contexts
        .get_mut(&context_id)
        .ok_or(NebulaError::ModelContextNotExist(context_id.clone()))?;

    ss.store(true, std::sync::atomic::Ordering::Relaxed);
    cc.lock().await.eval(dialog)?;
    Ok(())
}

/// Triggers the LLM to predict the next token in the current context.
/// Sends a stream of events to the JS side with the tokens. A final event is sent with the finished flag set to true to signal the end of the stream.
#[tauri::command]
async fn model_context_predict<R: Runtime>(
    model_path: String,
    context_id: String,
    predict_options: PredictOptions,
    app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<()> {
    let state = state.lock().await;
    let mm: &NebulaModelState = state
        .models
        .get(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    let (cc, ss) = mm
        .contexts
        .get(&context_id)
        .ok_or(NebulaError::ModelContextNotExist(context_id.clone()))?;

    let app_clone = app.clone();
    let model_path_clone = model_path.clone();
    let context_id_clone = context_id.clone();
    let ccc = ss.clone();

    ss.store(false, std::sync::atomic::Ordering::Relaxed);

    let mut ctx = cc.lock().await;
    let mut po = predict_options.clone();
    po.token_callback = Some(Arc::new(Box::new(move |token| {
        app_clone
            .emit_all(
                "nebula-predict",
                PredictPayload {
                    model: model_path_clone.clone(),
                    context: context_id_clone.clone(),
                    token: Some(token),
                    finished: false,
                },
            )
            .expect("Could not emit llm predict payload event");

        !ccc.load(std::sync::atomic::Ordering::Relaxed)
    })));
    let mut p = ctx.predict(po);
    p.predict()?;
    app.emit_all(
        "nebula-predict",
        PredictPayload {
            model: model_path,
            context: context_id,
            finished: true,
            token: None,
        },
    )
    .expect("Could not emit llm predict payload event");
    Ok(())
}

/// drop all loaded models
#[tauri::command]
async fn drop_all<R: Runtime>(
    _app: AppHandle<R>,
    state: State<'_, Mutex<NebulaState>>,
) -> NebulaResult<()> {
    let mut state = state.lock().await;

    state.models.clear();
    Ok(())
}

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("nebula")
        .invoke_handler(tauri::generate_handler![
            init_model,
            init_model_with_mmproj,
            drop_model,
            model_init_context,
            model_drop_context,
            model_context_eval,
            model_context_predict,
            drop_all,
            get_loaded_models
        ])
        .setup(|app_handle| {
            #[cfg(test)]
            let resource_path =
                std::path::PathBuf::from("nebula/backends/llama_cpp/llama-cpp-sys/dist");
            #[cfg(not(test))]
            let resource_path = app_handle
                .path_resolver()
                .resolve_resource("nebula/backends/llama_cpp/llama-cpp-sys/dist")
                .unwrap();

            nebula::init(resource_path).unwrap();

            app_handle.manage(Mutex::new(NebulaState::default()));
            Ok(())
        })
        .build()
}
