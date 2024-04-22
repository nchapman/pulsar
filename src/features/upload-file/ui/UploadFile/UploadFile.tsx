import { memo, ReactNode } from 'preact/compat';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Popover } from 'react-tiny-popover';

import CamIcon from '@/shared/assets/icons/cam.svg';
import FileIcon from '@/shared/assets/icons/file.svg';
import ImgIcon from '@/shared/assets/icons/img.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { useUploadFile } from '../../hooks/useUploadFile.ts';
import { FileData } from '../../types/upload-file.ts';
import { UploadedFile } from '../UploadedFile/UploadedFile.tsx';
import s from './UploadFile.module.scss';

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

  const [open, setOpen] = useState(false);

  const imgUpload = useRef<HTMLInputElement>(null);
  const fileUpload = useRef<HTMLInputElement>(null);

  const { onSelectFile, fileData, preview } = useUploadFile();

  useEffect(() => {
    onFileReceive(fileData);
  }, [fileData, onFileReceive]);

  const handleDeleteFile = useCallback(() => {
    onSelectFile();
    if (imgUpload.current) {
      imgUpload.current.value = '';
    }

    if (fileUpload.current) {
      fileUpload.current.value = '';
    }
  }, [onSelectFile]);

  const options: InputOption[] = useMemo(
    () => [
      { name: 'File', icon: FileIcon, onClick: () => fileUpload.current?.click() },
      { name: 'Photo or Video', icon: ImgIcon, onClick: () => imgUpload.current?.click() },
      { name: 'Web Camera', icon: CamIcon, onClick: () => console.log('Webcam') },
    ],
    []
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
      {fileData && <UploadedFile onDelete={handleDeleteFile} data={fileData} preview={preview} />}

      <Popover
        isOpen={open}
        positions={['top']}
        content={popover}
        align="start"
        padding={4}
        onClickOutside={() => setOpen(false)}
      >
        <div>
          <Button onClick={() => setOpen((pv) => !pv)} variant="secondary" icon={PlusIcon} />
        </div>
      </Popover>

      <input
        type="file"
        onChange={onSelectFile}
        ref={imgUpload}
        style={{ display: 'none' }}
        accept="image/*, video/*"
      />
      <input
        type="file"
        onChange={onSelectFile}
        ref={fileUpload}
        style={{ display: 'none' }}
        accept="application/*"
      />
    </div>
  );
});
