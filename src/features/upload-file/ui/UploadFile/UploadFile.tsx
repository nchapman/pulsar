import { useUnit } from 'effector-react';
import { memo, ReactNode } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Popover } from 'react-tiny-popover';

import { modelManager } from '@/entities/model';
import { FileData } from '@/features/upload-file';
// import CamIcon from '@/shared/assets/icons/cam.svg';
// import FileIcon from '@/shared/assets/icons/file.svg';
import ImgIcon from '@/shared/assets/icons/img.svg';
import PlusIcon from '@/shared/assets/icons/plus.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { UploadedFile } from '../UploadedFile/UploadedFile.tsx';
import s from './UploadFile.module.scss';

interface Props {
  className?: string;
  onUpload: (type: FileData['type']) => void;
  fileData?: FileData;
  onRemove: () => void;
}

interface InputOption {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}

export const UploadFile = memo((props: Props) => {
  const { className, onUpload, fileData, onRemove } = props;
  const currentMmp = useUnit(modelManager.state.$currentMmp);

  const [open, setOpen] = useState(false);

  const options: InputOption[] = useMemo(
    () => [
      // { name: 'File', icon: FileIcon, onClick: () => onUpload('application') },
      { name: 'Photo or Video', icon: ImgIcon, onClick: () => onUpload('image') },
      // { name: 'Web Camera', icon: CamIcon, onClick: () => console.log('Webcam') },
    ],
    [onUpload]
  );

  useEffect(() => {
    if (fileData) {
      setOpen(false);
    }
  }, [fileData]);

  if (!currentMmp) return <div />;

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
      {fileData && <UploadedFile onDelete={onRemove} fileData={fileData} />}

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
            type="button"
            onClick={() => setOpen((pv) => !pv)}
            variant="secondary"
            icon={PlusIcon}
          />
        </div>
      </Popover>
    </div>
  );
});
