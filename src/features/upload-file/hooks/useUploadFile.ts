import { useCallback, useEffect, useState } from 'preact/hooks';

import { FileData } from '@/features/upload-file/types/upload-file.ts';

export const useUploadFile = () => {
  const [fileData, setFileData] = useState<FileData>();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (fileData?.type !== 'image') {
      setPreview(undefined);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(fileData.file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [fileData]);

  const onSelectFile = useCallback((e?: Event) => {
    const { files } = (e?.target as HTMLInputElement) || {};
    if (!files?.length) {
      setFileData(undefined);
      return;
    }

    const file = files[0];
    const { name } = file;
    const ext = name.split('.').pop() || '';
    const type = file.type.split('/')[0] as FileData['type'];

    setFileData({ file, ext, name, type });
  }, []);

  return { preview, fileData, onSelectFile };
};
