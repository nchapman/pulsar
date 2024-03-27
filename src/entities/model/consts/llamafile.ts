import { Child, Command } from '@tauri-apps/api/shell';

export default class Llamafile {
  private command: Command;

  private process: Child | null;

  constructor(modelPath: string) {
    console.log('modelPath', modelPath);

    this.command = Command.sidecar('bin/llamafile', [
      '-m',
      modelPath,
      '--port',
      '52514',
      '--nobrowser',
      '-ngl',
      '9999',
    ]);
    this.process = null;

    this.command.on('error', console.error);
    this.command.stdout.on('data', console.log);
    this.command.stderr.on('data', console.error);
  }

  async spawn() {
    this.process = await this.command.spawn();
    return this.process;
  }

  async kill() {
    return this.process?.kill();
  }
}
