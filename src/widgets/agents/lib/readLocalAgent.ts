import { readTextFile } from '@tauri-apps/api/fs';

import { AgentFsName } from '@/widgets/agents/consts/agentFsName.ts';
import { getAgentPath } from '@/widgets/agents/lib/getAgentPath.ts';
import { AgentManifest } from '@/widgets/agents/types/agent.types.ts';

export async function readLocalAgent(agentName: string) {
  try {
    const agentDir = await getAgentPath(agentName);

    const workerScript = await readTextFile(`${agentDir}/${AgentFsName.AGENT_FILE}`);
    const manifest: AgentManifest = JSON.parse(
      await readTextFile(`${agentDir}/${AgentFsName.MANIFEST_FILE}`)
    );
    Object.keys(manifest.icons).forEach((i) => {
      manifest.icons[i as '16'] = `${agentDir}/${i}`;
    });

    return { workerScript, manifest };
  } catch (e) {
    throw new Error('Failed to read local agent');
  }
}
