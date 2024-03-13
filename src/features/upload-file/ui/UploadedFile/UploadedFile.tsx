import { memo } from 'preact/compat';

import FileIcon from '@/shared/assets/icons/file.svg';
import CloseIcon from '@/shared/assets/icons/x-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import { FileData } from '../../types/upload-file.ts';
import s from './UploadedFile.module.scss';

interface Props {
  className?: string;
  data: FileData;
  onDelete: () => void;
  preview?: string;
}

export const UploadedFile = memo((props: Props) => {
  const { className, data, onDelete, preview } = props;

  const fileIcon = (
    <div className={s.icon}>
      {preview ? (
        <img className={s.preview} src={preview} alt={data.name} />
      ) : (
        <Icon size={20} svg={FileIcon} />
      )}
    </div>
  );

  const info = (
    <div className={s.info}>
      <Text c="primary" s={12} w="medium" className={s.name}>
        {data.name}
      </Text>
      <Text s={12}>{data.ext.toUpperCase()}</Text>
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
