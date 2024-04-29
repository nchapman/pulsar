import { convertFileSrc } from '@tauri-apps/api/tauri';
import { memo } from 'preact/compat';

import FileIcon from '@/shared/assets/icons/file.svg';
import CloseIcon from '@/shared/assets/icons/x-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import { FileData } from '../../types/upload-file.ts';
import s from './UploadedFile.module.scss';

interface Props {
  className?: string;
  onDelete: () => void;
  fileData: FileData;
}

export const UploadedFile = memo((props: Props) => {
  const { className, onDelete, fileData } = props;
  const { src, name, type, ext } = fileData;

  const fileIcon = (
    <div className={s.icon}>
      {type === 'image' ? (
        <img className={s.preview} src={convertFileSrc(src)} alt="img" />
      ) : (
        <Icon size={20} svg={FileIcon} />
      )}
    </div>
  );

  const info = (
    <div className={s.info}>
      <Text c="primary" s={12} w="medium" className={s.name}>
        {name}
      </Text>
      <Text s={12}>{ext.toUpperCase()}</Text>
    </div>
  );

  return (
    <div className={classNames(s.uploadedFile, [className])}>
      {fileIcon}
      {info}
      <Button variant="clear" icon={CloseIcon} onClick={onDelete} />
    </div>
  );
});
