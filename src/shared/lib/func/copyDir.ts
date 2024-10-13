import { BaseDirectory, copyFile, createDir, readDir } from '@tauri-apps/api/fs';

export async function copyDir(src: string, dest: string) {
  try {
    const folderName = src.split('/').pop();
    // eslint-disable-next-line no-param-reassign
    dest = `${dest}/${folderName}`;
    await createDir(dest, { dir: BaseDirectory.AppData });
    const files = await readDir(src);

    for await (const file of files) {
      if (file.children) {
        await copyDir(`${src}/${file.name}`, dest);
      } else {
        await copyFile(`${src}/${file.name}`, `${dest}/${file.name}`, {
          dir: BaseDirectory.AppData,
        });
      }
    }
  } catch (e) {
    throw new Error(`Failed to copy directory ${src}: ${e}`);
  }
}
