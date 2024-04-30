fn main() {
    if cfg!(target_os = "macos") {
        println!("cargo:rustc-link-arg=-Wl,-undefined,dynamic_lookup,-lomp,-L/opt/homebrew/opt/libomp/lib");
    } else if cfg!(target_os = "linux") {
        println!("cargo:rustc-link-arg=-Wl,-undefined,dynamic_lookup,-lstdc++");
    }

    tauri_build::build()
}
