# Downloading/Uploading

You can use the integrated [tauri-plugin-download] to download/upload files in an async manner with event notifications.

```ts
import { upload } from 'tauri-plugin-upload-api';

upload(
  'https://example.com/file-upload',
  './path/to/my/file.txt',
  (progress, total) => console.log(`Uploaded ${progress} of ${total} bytes`), // a callback that will be called with the upload progress
  { 'Content-Type': 'text/plain' } // optional headers to send with the request
);
import { download } from 'tauri-plugin-upload-api';

download(
  'https://example.com/file-download-link',
  './path/to/save/my/file.txt',
  (progress, total) => console.log(`Downloaded ${progress} of ${total} bytes`), // a callback that will be called with the download progress
  { 'Content-Type': 'text/plain' } // optional headers to send with the request
);
```

