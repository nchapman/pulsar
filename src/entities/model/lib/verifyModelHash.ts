// import { fs } from '@tauri-apps/api';
// import { BaseDirectory } from '@tauri-apps/api/fs';
//
// import { APP_DIRS } from '@/app/consts/app.const.ts';
//
// import { LlmName, supportedLlms } from '../consts/supported-llms.const.ts';
//
// function verifyModelHash(model: LlmName) {
//   const file = fs
//     .readBinaryFile(`${APP_DIRS.MODELS}/${model}`, { dir: BaseDirectory.AppData })
//     .then(console.log);
//
//
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function () {
//       const arrayBuffer = reader.result;
//       crypto.subtle
//         .digest('SHA-256', arrayBuffer)
//         .then((hash) => {
//           const hashArray = Array.from(new Uint8Array(hash));
//           const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
//           document.getElementById('hashResult').textContent = `SHA-256 hash: ${hashHex}`;
//         })
//         .catch((err) => console.error('Error:', err));
//     };
//     reader.readAsArrayBuffer(file);
//   }
// }
