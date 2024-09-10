import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';

import { loge, logi } from '@/shared/lib/Logger';
import { relaunch } from '@tauri-apps/api/process';

export async function updateApp() {
  // Install the update. This will also restart the app on Windows!
  await installUpdate();

  // On macOS and Linux you will need to restart the app manually.
  // You could use this step to display another confirmation dialog.
  await relaunch();
}

export async function shouldUpdateApp() {
  try {
    // @ts-ignore
    if (import.meta.env.DEV) {
      logi('Updates', 'Development mode, skipping updates check');
      return;
    }

    const { shouldUpdate } = await checkUpdate();

    return shouldUpdate;
  } catch (error: any) {
    loge('Updates', error.toString());
  }
}
