# Pulsar

### This is a desktop app using the following technologies.

#### Tools:

- Desktop framework: Tauri
- Bundler: Vite
- Package manager: yarn

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
```

## Corepack

Project is using yarn v4. You don't need to install anything but you do need to enable corepack. Before running any other command run:

```bash
corepack enable
```

Corepack is a nodejs module that enables to use other package managers (pnpm, yarn) without the need to install them

## Setup llamafile

This is a temporary development integration. llamafile is now integrated into the GitHub repo but manually downloading the model is still required to run the app. This shouldn't interfere with the build process even those builds won't actually work without the model.

```bash
# Download the Dolphin Mistral model
mkdir -p src-tauri/models
curl -L -o src-tauri/models/dolphin-2.6-mistral-7b.Q4_K_M.gguf https://huggingface.co/TheBloke/dolphin-2.6-mistral-7B-GGUF/resolve/main/dolphin-2.6-mistral-7b.Q4_K_M.gguf

curl -L -o src-tauri/models/llava-v1.6-mistral-7b.Q5_K_M.gguf https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q5_K_M.gguf
```

## Start the app

```bash
yarn
yarn start
```

## Testing

```bash
bun test
```

## Commits

Please, use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) for naming your commits

type(where): action description

example:

feat(chat): add initial screen

See more examples in commits history.

```bash

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

