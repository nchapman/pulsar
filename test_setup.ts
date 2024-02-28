import { clearMocks } from '@tauri-apps/api/mocks';
import { afterEach } from 'bun:test';

afterEach(() => {
  clearMocks();
});
