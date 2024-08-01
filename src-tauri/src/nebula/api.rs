use crate::nebula::error::NebulaError;
use crate::nebula::error::NebulaResult;
use base64::prelude::*;
use nebula::options::{ContextOptions, ModelOptions};
use serde::Serialize;
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

#[derive(Default)]
struct NebulaState {
    models: Arc<Mutex<HashMap<String, NebulaModelState>>>,
}

#[derive(Clone, Serialize)]
struct LoadProgressPayload {
    model: String,
    progress: f32,
}

#[tauri::command]
async fn get_loaded_models(state: State<'_, NebulaState>) -> Result<Vec<String>, NebulaError> {
    let models = state.models.lock().await;
    let loaded_models: Vec<String> = models.keys().cloned().collect();
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
    state: State<'_, NebulaState>,
) -> NebulaResult<String> {
    let mut models = state.models.lock().await;

    if models.contains_key(&model_path) {
        return Ok(model_path.clone());
    }

    let cloned_path = model_path.clone();

    models.insert(
        model_path.clone(),
        NebulaModelState {
            model: Arc::new(Mutex::new(nebula::Model::new_with_progress_callback(
                model_path.clone(),
                model_options,
                move |a| {
                    let _ = window.emit(
                        "nebula://load-progress",
                        LoadProgressPayload {
                            model: cloned_path.clone(),
                            progress: a,
                        },
                    );
                    true
                },
            )?)),
            contexts: HashMap::new(),
        },
    );

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
    state: State<'_, NebulaState>,
) -> NebulaResult<String> {
    let mut models = state.models.lock().await;

    if models.contains_key(&model_path) {
        return Ok(model_path.clone());
    }
    let cloned_path = model_path.clone();

    let model = nebula::Model::new_with_mmproj_with_callback(
        model_path.clone(),
        mmproj_path.clone(),
        model_options,
        move |a| {
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
        model: Arc::new(Mutex::new(model)),
        contexts: HashMap::new(),
    };

    models.insert(model_path.clone(), model_state);

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
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let mut models = state.models.lock().await;

    models
        .remove(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

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
    state: State<'_, NebulaState>,
) -> NebulaResult<String> {
    let mut models = state.models.lock().await;

    let model = models
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
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let mut models = state.models.lock().await;
    let model = models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    model.contexts.remove(&context_id);

    Ok(())
}

/// evaluate string to context.
///
/// * - `model_path` - model created by `init_model` or
/// `init_model_with_mmproj`
/// * - `context` - context created with `model_init_context`
/// * - `data` - string for evaluating
/// * - `use_bos` - Use BOS token for `data` evaluation
///
#[tauri::command]
async fn model_context_eval_string<R: Runtime>(
    model_path: String,
    context_id: String,
    data: String,
    use_bos: bool,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let mut models = state.models.lock().await;

    let model = models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    let (cc, ss) = model
        .contexts
        .get_mut(&context_id)
        .ok_or(NebulaError::ModelContextNotExist(context_id.clone()))?;

    ss.store(true, std::sync::atomic::Ordering::Relaxed);
    cc.lock().await.eval_str(&data, use_bos)?;
    Ok(())
}

/// evaluate image to context.
///
/// * - `model` - model creted by `init_model_with_mmproj`
/// * - `context` - context created with `model_init_context`
/// * - `base64_encoded_image` - base64 encoded image content
/// * - `prompt` - Prompt evaluate for image
///
#[tauri::command]
async fn model_context_eval_image<R: Runtime>(
    model_path: String,
    context_id: String,
    base64_encoded_image: String,
    prompt: String,
    _app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let mut models = state.models.lock().await;

    let decoded_image = if base64_encoded_image.starts_with("data:") {
        let data_start = base64_encoded_image.find(',').unwrap();
        let encoded_data = &base64_encoded_image[data_start + 1..];
        BASE64_STANDARD.decode(encoded_data.as_bytes())?
    } else {
        BASE64_STANDARD.decode(base64_encoded_image.as_bytes())?
    };

    let model = models
        .get_mut(&model_path)
        .ok_or(NebulaError::ModelNotLoaded(model_path.clone()))?;

    let (cc, ss) = model
        .contexts
        .get_mut(&context_id)
        .ok_or(NebulaError::ModelContextNotExist(context_id.clone()))?;

    ss.store(true, std::sync::atomic::Ordering::Relaxed);
    cc.lock().await.eval_image(decoded_image, &prompt)?;

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

/// Triggers the LLM to predict the next token in the current context.
/// Sends a stream of events to the JS side with the tokens. A final event is sent with the finished flag set to true to signal the end of the stream.
#[tauri::command]
async fn model_context_predict<R: Runtime>(
    model_path: String,
    context_id: String,
    max_len: Option<usize>,
    temp: Option<f32>,
    top_p: Option<f32>,
    app: AppHandle<R>,
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let lock = state.models.lock().await;
    let mm = lock
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
    let mut p = ctx.predict().with_token_callback(Box::new(move |token| {
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
    }));
    if let Some(max_len) = max_len {
        p = p.with_max_len(max_len);
    }
    if let Some(temp) = temp {
        p = p.with_temp(temp);
    }
    if let Some(top_p) = top_p {
        p = p.with_top_p(top_p);
    }

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
    state: State<'_, NebulaState>,
) -> NebulaResult<()> {
    let mut models = state.models.lock().await;

    models.clear();
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
            model_context_eval_string,
            model_context_eval_image,
            model_context_predict,
            drop_all,
            get_loaded_models
        ])
        .setup(|app_handle| {
            #[cfg(test)]
            let resource_path = std::path::PathBuf::from("nebula/backends/llama_cpp/llama-cpp-sys/dist");
            #[cfg(not(test))]
            let resource_path = app_handle.path_resolver().resolve_resource("nebula/backends/llama_cpp/llama-cpp-sys/dist").unwrap();
            eprintln!("{:?}", resource_path);
            nebula::init(resource_path).unwrap();
            app_handle.manage(NebulaState::default());
            Ok(())
        })
        .build()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::Path;
    use tauri::{
        test::{mock_context, noop_assets, MockRuntime},
        App,
    };

    fn before_each() -> Result<tauri::App<MockRuntime>, std::io::Error> {
        let app = tauri::test::mock_builder()
            .plugin(super::init_plugin())
            .build(mock_context(noop_assets()))
            .unwrap();

        let source_path = Path::new("tests/evolvedseeker_1_3.Q2_K.gguf");
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_dir = app_data_dir.join("models");
        if !model_dir.exists() {
            fs::create_dir_all(model_dir.clone()).unwrap();
        }

        let model_path = model_dir.join("evolvedseeker_1_3.Q2_K.gguf");

        if !model_path.exists() {
            fs::copy(source_path, model_path)?;
        }

        Ok(app)
    }

    async fn after_each(app: App<MockRuntime>) {
        let state = app.state::<NebulaState>();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_dir = app_data_dir.join("models");
        fs::remove_dir_all(model_dir).unwrap();

        let mut models = state.models.lock().await;

        models.clear();
    }

    #[tokio::test]
    async fn should_return_0_with_no_loaded_models() {
        let app = before_each().unwrap();
        let window = app.get_window("main").unwrap();
        let loaded_models_res = tauri::test::get_ipc_response::<Vec<String>>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|get_loaded_models".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({}),
            },
        );

        assert!(loaded_models_res.is_ok());
        assert_eq!(loaded_models_res.unwrap().len(), 0);

        after_each(app).await;
    }

    #[tokio::test]
    async fn should_return_1_with_loaded_model() {
        let app = before_each().unwrap();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let window = app.get_window("main").unwrap();
        let model_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res.is_ok());

        let loaded_models_res = tauri::test::get_ipc_response::<Vec<String>>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|get_loaded_models".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({}),
            },
        );

        assert!(loaded_models_res.is_ok());
        let loaded_models = loaded_models_res.unwrap();
        assert_eq!(loaded_models.len(), 1);
        assert_eq!(loaded_models[0], model_path);

        after_each(app).await;
    }

    #[tokio::test]
    async fn should_drop_all_models() {
        let app = before_each().unwrap();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let window = app.get_window("main").unwrap();
        let model_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res.is_ok());

        let drop_all_res = tauri::test::get_ipc_response::<()>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|drop_all".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({}),
            },
        );

        assert!(drop_all_res.is_ok());

        let loaded_models_res = tauri::test::get_ipc_response::<Vec<String>>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|get_loaded_models".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({}),
            },
        );

        assert!(loaded_models_res.is_ok());
        let loaded_models = loaded_models_res.unwrap();
        assert_eq!(loaded_models.len(), 0);

        after_each(app).await;
    }

    #[tokio::test]
    async fn should_drop_model() {
        let app = before_each().unwrap();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let window = app.get_window("main").unwrap();
        let model_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res.is_ok());

        let model = model_init_res.unwrap();

        let model_drop_res = tauri::test::get_ipc_response::<()>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|drop_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model,
                }),
            },
        );

        assert!(model_drop_res.is_ok());

        after_each(app).await;
    }

    #[tokio::test]
    async fn loading_same_model_not_throws_still_returns_1_loaded_model() {
        let app = before_each().unwrap();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let window = app.get_window("main").unwrap();
        let model_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res.is_ok());

        let model_init_res_2 = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res_2.is_ok());

        let loaded_models_res = tauri::test::get_ipc_response::<Vec<String>>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|get_loaded_models".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({}),
            },
        );

        assert!(loaded_models_res.is_ok());
        let loaded_models = loaded_models_res.unwrap();
        assert_eq!(loaded_models.len(), 1);
        assert_eq!(loaded_models[0], model_path);

        after_each(app).await;
    }

    #[tokio::test]
    async fn should_predict_text() {
        let app = before_each().unwrap();
        let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
        let model_path = app_data_dir
            .join("models/evolvedseeker_1_3.Q2_K.gguf")
            .to_string_lossy()
            .to_string();
        let window = app.get_window("main").unwrap();
        let model_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|init_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "modelOptions": {}
                }),
            },
        );

        assert!(model_init_res.is_ok());

        let model_path = model_init_res.unwrap();

        let context_init_res = tauri::test::get_ipc_response::<String>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|model_init_context".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "contextOptions": {
                        "ctx": [{"message": "Hello, world!", "is_user": true}, {"message": "How are you doing?", "is_user": false}]
                    }
                }),
            },
        );

        assert!(context_init_res.is_ok());

        let context_id = context_init_res.unwrap();

        // let _id = app.listen_global("nebula-predict", |event| {
        //     // println!("Received event: {:?}", event.payload().unwrap());
        //     let predicted_text = event.payload().unwrap();
        //     assert_eq!(predicted_text, "How are you doing?".to_string());
        // });

        let predict_res = tauri::test::get_ipc_response::<()>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|model_context_predict".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                    "contextId": context_id,
                    "maxLen": 10
                }),
            },
        );

        assert!(predict_res.is_ok());

        let model_drop_res = tauri::test::get_ipc_response::<()>(
            &window,
            tauri::InvokePayload {
                cmd: "plugin:nebula|drop_model".into(),
                tauri_module: None,
                invoke_key: Some(tauri::test::INVOKE_KEY.into()),
                callback: tauri::api::ipc::CallbackFn(0),
                error: tauri::api::ipc::CallbackFn(1),
                inner: serde_json::json!({
                    "modelPath": model_path,
                }),
            },
        );

        assert!(model_drop_res.is_ok());

        after_each(app).await;
    }
}
