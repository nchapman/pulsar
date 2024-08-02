import { open as openDialog } from '@tauri-apps/api/dialog';
import { useCallback, useState } from 'preact/hooks';

import { saveMedia } from '../lib/saveMedia.ts';
import { FileData } from '../types/upload-file.ts';

const filters: Record<FileData['type'], { name: string; extensions: string[] }> = {
  image: {
    name: 'Image',
    extensions: ['png', 'jpeg', 'jpg', 'webp'],
  },
  video: {
    name: 'Video',
    extensions: ['mp4'],
  },
  application: {
    name: 'Application',
    extensions: ['pdf'],
  },
};

export const useUploadFile = () => {
  const [fileData, setFileData] = useState<FileData>();

  const uploadFile = useCallback(async (type: FileData['type']) => {
    const selected = await openDialog({
      multiple: false,
      filters: [filters[type]],
    });

    if (selected === null) return;

    const src = await saveMedia(selected as string);
    const ext = src.split('.').pop() || '';
    const name = src.split('/').pop() || '';
    const fileData: FileData = { type, ext, name, src };
    setFileData(fileData);
  }, []);

  const resetFileData = useCallback(() => {
    setFileData(undefined);
  }, []);

  return { uploadFile, fileData, resetFileData };
};
