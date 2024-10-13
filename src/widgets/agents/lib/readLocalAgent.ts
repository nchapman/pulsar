import { readTextFile } from '@tauri-apps/api/fs';

import { AgentFsName } from '../consts/agentFsName.ts';
import { AgentManifest } from '../types/agent.types.ts';
import { getAgentPath } from './getAgentPath.ts';

export async function readLocalAgent(
  agentName: string,
  include: {
    script?: boolean;
    manifest?: boolean;
  }
) {
  try {
    const agentDir = await getAgentPath(agentName);

    let workerScript = '';
    let manifest: AgentManifest = {} as AgentManifest;

    if (include?.script) {
      workerScript = await readTextFile(`${agentDir}/${AgentFsName.AGENT_FILE}`);
    }

    if (include?.manifest) {
      manifest = JSON.parse(await readTextFile(`${agentDir}/${AgentFsName.MANIFEST_FILE}`));
      Object.keys(manifest.icons).forEach((i) => {
        manifest.icons[i as '16'] = `${agentDir}/${i}`;
      });
    }

    return { workerScript, manifest };
  } catch (e) {
    throw new Error('Failed to read local agent');
  }
}
