import { os } from '@tauri-apps/api';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { createEvent, createStore } from 'effector';

export const windowSize = {
  onboarding: {
    width: 600,
    height: 784,
  },
  main: {
    width: 1200,
    height: 740,
  },
};
const getIsResizable = () => windowSize.onboarding.width < window.innerWidth;

export const $isResizable = createStore(getIsResizable());
const updateIsResizable = createEvent();
$isResizable.on(updateIsResizable, () => getIsResizable());

async function isWindows() {
  return (await os.type()) === 'Windows_NT';
}

export async function minimizeWindowSize() {
  updateIsResizable();
  appWindow.setMinSize(new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height));
  appWindow.setSize(new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height));

  if (!(await isWindows())) {
    appWindow.setFullscreen(false);
    appWindow.setResizable(false);
  }
}

export async function restoreWindowSize() {
  updateIsResizable();
  if (window.innerWidth >= windowSize.main.width) return;
  await appWindow.setMinSize(new LogicalSize(windowSize.main.width, windowSize.main.height));
  appWindow.setSize(new LogicalSize(windowSize.main.width, windowSize.main.height));
  appWindow.setResizable(true);
}
