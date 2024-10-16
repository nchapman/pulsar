use std::fs;
use std::path::Path;
use tauri::{async_runtime::Mutex, Manager};
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
    let state = app.state::<Mutex<super::NebulaState>>();
    let app_data_dir = app.handle().path_resolver().app_data_dir().unwrap();
    let model_dir = app_data_dir.join("models");
    fs::remove_dir_all(model_dir).unwrap();

    let mut state = state.lock().await;
    state.models.clear();
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
                "modelPath": model_path.clone(),
                "contextOptions": {
                    "n_ctx": 20000
                }
            }),
        },
    );

    assert!(context_init_res.is_ok());

    let context_id = context_init_res.unwrap();

    let inner = serde_json::json!({
        "modelPath": model_path.clone(),
        "contextId": context_id.clone(),
        "dialog": [{"content": "Hello, world!", "role": "user"}, {"content": "How are you doing?", "role": "assistant"}]
    });

    let context_eval_res = tauri::test::get_ipc_response::<()>(
        &window,
        tauri::InvokePayload {
            cmd: "plugin:nebula|model_context_eval".into(),
            tauri_module: None,
            invoke_key: Some(tauri::test::INVOKE_KEY.into()),
            callback: tauri::api::ipc::CallbackFn(0),
            error: tauri::api::ipc::CallbackFn(1),
            inner,
        },
    );

    assert!(context_eval_res.is_ok());

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
                "predictOptions": {
                    "max_len": 10,
                    "temp": 0.5
                },
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
