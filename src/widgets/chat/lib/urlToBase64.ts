import { readBinaryFile } from '@tauri-apps/api/fs';

export async function urlToBase64(url: string): Promise<string> {
  const file = await readBinaryFile(url);

  let binaryString = '';
  file.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  // Convert the string to base64
  return btoa(binaryString);
}
