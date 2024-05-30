# Downloading/Uploading

We have created our own custom file transfer module to download/upload files in an async manner with event notifications.

```ts
import { download } from '@/libs/file-transfer.ts';

download(
  'https://example.com/file-download-link',
  './path/to/save/my/file.txt',
  (progress, total) => console.log(`Downloaded ${progress} of ${total} bytes`), // a callback that will be called with the download progress
  { 'Content-Type': 'text/plain' } // optional headers to send with the request
);
```

