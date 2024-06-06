import { os } from '@tauri-apps/api';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';

const windowSize = {
  onboarding: {
    width: 600,
    height: 784,
  },
  main: {
    width: 1060,
    height: 740,
  },
};

async function isWindows() {
  return (await os.type()) === 'Windows_NT';
}

export async function minimizeWindowSize() {
  appWindow.setMinSize(new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height));
  appWindow.setSize(new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height));

  if (!(await isWindows())) {
    appWindow.setFullscreen(false);
    appWindow.setResizable(false);
  }
}

export async function restoreWindowSize() {
  if (window.innerWidth > windowSize.onboarding.width) return;
  await appWindow.setMinSize(new LogicalSize(windowSize.main.width, windowSize.main.height));
  appWindow.setSize(new LogicalSize(windowSize.main.width, windowSize.main.height));
  appWindow.setResizable(true);
}
