use tauri::{plugin::TauriPlugin, Runtime};

type Result<T> = std::result::Result<T, Error>;

pub fn init_plugin<R: Runtime>() -> TauriPlugin<R> {
    PluginBuilder::new("fs")
        .invoke_handler(tauri::generate_handler![get_byte_size])
        .build()
}
