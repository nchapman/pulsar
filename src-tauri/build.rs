fn main() {
    // Re-add when sqlite-vss or sqlite-vec is installed
    // Also add the install step in the CI workflows
    // if cfg!(target_os = "macos") {
    //     println!("cargo:rustc-link-arg=-Wl,-undefined,dynamic_lookup,-lomp,-L/opt/homebrew/opt/libomp/lib");
    // } else if cfg!(target_os = "linux") {
    //     println!("cargo:rustc-link-arg=-Wl,-undefined,dynamic_lookup,-lstdc++");
    // }

    tauri_build::build()
}
