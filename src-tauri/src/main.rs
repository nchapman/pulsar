// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app.handle().path_resolver().app_data_dir();
    println!("Data dir");
    println!("\x1b[34m{}\x1b[0m", app_data_dir.unwrap().to_str().unwrap());
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(setup)
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_nebula::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
