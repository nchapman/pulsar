import { appWindow, LogicalSize } from '@tauri-apps/api/window';

export async function minimizeWindowSize() {
  appWindow.setMinSize(new LogicalSize(600, 784));
  appWindow.setSize(new LogicalSize(600, 784));
  appWindow.setFullscreen(false);
  appWindow.setResizable(false);
}

export async function restoreWindowSize() {
  if ((await appWindow.innerSize()).width > 600) return;
  appWindow.setSize(new LogicalSize(1060, 740));
  appWindow.setMinSize(new LogicalSize(1060, 740));
  appWindow.setResizable(true);
}
