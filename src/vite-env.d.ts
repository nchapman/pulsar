/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_HIRO_SHOW_DEV_MENU: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
