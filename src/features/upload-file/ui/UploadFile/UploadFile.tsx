import { memo, ReactNode } from 'preact/compat';
import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import { Popover } from 'react-tiny-popover';

import {
  UploadedFile,
  UploadedFileUIData,
} from '@/features/upload-file/ui/UploadedFile/UploadedFile.tsx';
import CamIcon from '@/shared/assets/icons/cam.svg';
import FileIcon from '@/shared/assets/icons/file.svg';
import ImgIcon from '@/shared/assets/icons/img.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './UploadFile.module.scss';

export interface FileData {
  file: File;
  ext: string;
  name: string;
  type: 'application' | 'img' | 'video';
}
interface Props {
  className?: string;
  onFileReceive: (data?: FileData) => void;
}

interface InputOption {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}

export const UploadFile = memo((props: Props) => {
  const { className, onFileReceive } = props;

  const imgUpload = useRef<HTMLInputElement>(null);
  const fileUpload = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uiFile, setUIFile] = useState<UploadedFileUIData>();

  const handleOpenFile = useCallback(() => {
    fileUpload.current?.click();
  }, []);

  const handleOpenImg = useCallback(() => {
    imgUpload.current?.click();
  }, []);

  const handleOpenWebcam = useCallback(() => {
    console.log('Webcam');
  }, []);

  const handleReceiveFile = useCallback(
    (e: Event) => {
      const { files } = e.target as HTMLInputElement;
      const file = files?.[0];
      if (!file) return;
      const { name } = file;
      const ext = name.split('.').pop() || '';
      const type = file.type.split('/')[0] as FileData['type'];

      onFileReceive({ file, ext, name, type });
      setUIFile({ name, ext });
    },
    [onFileReceive]
  );

  const handleDeleteFile = useCallback(() => {
    setUIFile(undefined);
    onFileReceive();
  }, [onFileReceive]);

  const options: InputOption[] = useMemo(
    () => [
      { name: 'File', icon: FileIcon, onClick: handleOpenFile },
      { name: 'Photo or Video', icon: ImgIcon, onClick: handleOpenImg },
      { name: 'Web Camera', icon: CamIcon, onClick: handleOpenWebcam },
    ],
    [handleOpenFile, handleOpenImg, handleOpenWebcam]
  );

  const popover = (
    <div className={s.popover}>
      <Text className={s.hint} s={12}>
        Upload from your computer
      </Text>

      <div>
        {options.map((i) => (
          <Button key={i.name} className={s.inputOption} variant="clear" onClick={i.onClick}>
            {/* @ts-ignore */}
            <i.icon />
            {i.name}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={classNames(s.uploadFile, [className])}>
      {uiFile && <UploadedFile onDelete={handleDeleteFile} data={uiFile} />}
      <Popover
        isOpen={open}
        positions={['top']}
        content={popover}
        align="start"
        padding={4}
        onClickOutside={() => setOpen(false)}
      >
        <div>
          <Button
            onClick={() => setOpen((pv) => !pv)}
            className={s.triger}
            variant="secondary"
            icon={PlusIcon}
          />
        </div>
      </Popover>

      <input
        type="file"
        onChange={handleReceiveFile}
        ref={imgUpload}
        style={{ display: 'none' }}
        accept="image/*, video/*"
      />
      <input
        type="file"
        onChange={handleReceiveFile}
        ref={fileUpload}
        style={{ display: 'none' }}
        accept="application/*"
      />
    </div>
  );
});
