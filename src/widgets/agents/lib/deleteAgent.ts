import { removeDir } from '@tauri-apps/api/fs';

import { getAgentPath } from './getAgentPath.ts';

export async function deleteAgent(name: string) {
  await removeDir(await getAgentPath(name), { recursive: true });
}
