import { memo } from 'preact/compat';

import CloseIcon from '@/shared/assets/icons/x-circle.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import s from './UploadedFile.module.scss';

export interface UploadedFileUIData {
  name: string;
  ext: string;
}

interface Props {
  className?: string;
  data: UploadedFileUIData;
  onDelete: () => void;
}

export const UploadedFile = memo((props: Props) => {
  const { className, data, onDelete } = props;

  return (
    <div className={classNames(s.uploadedFile, [className])}>
      <div className={s.icon}></div>
      <div className={s.info}>
        <Text c="primary" s={12} w="medium" className={s.name}>
          {data.name}
        </Text>
        <Text s={12}>{data.ext.toUpperCase()}</Text>
      </div>
      <Button variant="clear" icon={CloseIcon} onClick={onDelete} />
    </div>
  );
});
