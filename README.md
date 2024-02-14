# Pulsar

### This is a desktop app using the following technologies.

#### Tools:

- Desktop framework: Tauri
- Bundler: Vite
- Package manager: Bun

#### Front-End:

- UI framework: Preact
- Language: TypeScript
- State manager: Effector
- Styles: CSS modules & Sass
- UI library: Headless UI
- Architecture: Feature Sliced Design
- Database: WatermelonDB

#### Back-End:

- Language: Rust

## Requirements

```bash
brew install rust
brew install bun
```

## Setup llamafile

This is a temporary development integration for macOS. This will be a more permanent solution soon!

```bash
# Download the llamafile binary
mkdir -p src-tauri/bin
curl -L -o src-tauri/bin/llamafile-aarch64-apple-darwin https://github.com/Mozilla-Ocho/llamafile/releases/download/0.6.2/llamafile-0.6.2
chmod +x src-tauri/bin/llamafile-aarch64-apple-darwin

# Download the Dolphin Mistral model
mkdir -p src-tauri/models
curl -L -o src-tauri/models/dolphin-2.6-mistral-7b.Q4_K_M.gguf https://huggingface.co/TheBloke/dolphin-2.6-mistral-7B-GGUF/resolve/main/dolphin-2.6-mistral-7b.Q4_K_M.gguf
```

## Bun install and start

```bash
bun install
bun start
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

