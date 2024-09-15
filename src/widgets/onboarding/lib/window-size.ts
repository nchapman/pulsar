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
const getIsResizable = () => window.innerWidth >= windowSize.main.width;

export const $isResizable = createStore(getIsResizable());
const updateIsResizable = createEvent();
$isResizable.on(updateIsResizable, () => getIsResizable());

export async function isWindows() {
  return (await os.type()) === 'Windows_NT';
}

export async function isMacOS() {
  return (await os.type()) === 'Darwin';
}

export async function minimizeWindowSize() {
  appWindow.setMinSize(new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height));
  await appWindow.setSize(
    new LogicalSize(windowSize.onboarding.width, windowSize.onboarding.height)
  );

  appWindow.setFullscreen(false);
  appWindow.setResizable(false);

  updateIsResizable();
}

export async function restoreWindowSize() {
  appWindow.setMinSize(new LogicalSize(windowSize.main.width, windowSize.main.height));

  if (window.innerWidth >= windowSize.main.width) return;
  await appWindow.setSize(new LogicalSize(windowSize.main.width, windowSize.main.height));
  appWindow.setResizable(true);
  updateIsResizable();
}
