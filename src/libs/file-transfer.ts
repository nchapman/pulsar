import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';

interface ProgressPayload {
  id: number;
  progress: number;
  total: number;
}

type ProgressHandler = (id: number, progress: number, total: number) => void;
const handlers: Map<number, ProgressHandler> = new Map();
let listening = false;

function listenToEventIfNeeded(event: string): void {
  if (listening) {
    return;
  }

  // We're not awaiting this Promise to prevent issues with Promise.all
  // the listener will still be registered in time.
  appWindow.listen<ProgressPayload>(event, ({ payload }) => {
    const handler = handlers.get(payload.id);
    if (handler != null) {
      handler(payload.id, payload.progress, payload.total);
    }
  });

  listening = true;
}

export function interruptFileTransfer(id: number): void {
  invoke('plugin:file_transfer|interrupt', { id });
}

export function getRandomInt(): number {
  const ids = new Uint32Array(1);
  window.crypto.getRandomValues(ids);
  return ids[0];
}

export async function upload({
  id = getRandomInt(),
  url,
  path,
  progressHandler,
  headers,
}: {
  id: number;
  url: string;
  path: string;
  progressHandler?: ProgressHandler;
  headers?: Map<string, string>;
}): Promise<string> {
  if (progressHandler != null) {
    handlers.set(id, progressHandler);
  }

  listenToEventIfNeeded('file_transfer://progress');

  return invoke('plugin:file_transfer|upload', {
    id,
    url,
    path,
    headers: headers ?? {},
  });
}

/// Download file from given url.
///
/// Note that `filePath` currently must include the file name.
/// Furthermore the progress events will report a total length of 0 if the server did not sent a `Content-Length` header or if the file is compressed.
export async function download({
  id = getRandomInt(),
  url,
  path,
  progressHandler,
  headers,
}: {
  id?: number;
  url: string;
  path: string;
  progressHandler?: ProgressHandler;
  headers?: Map<string, string>;
}): Promise<void> {
  if (progressHandler != null) {
    handlers.set(id, progressHandler);
  }

  await listenToEventIfNeeded('download://progress');

  await invoke('plugin:file_transfer|download', {
    id,
    url,
    path,
    headers: headers ?? {},
  });
}

