/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PULSAR_SHOW_DEV_MENU: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
