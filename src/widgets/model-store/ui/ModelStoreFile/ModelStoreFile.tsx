import { memo } from 'preact/compat';

import { ModelFileType } from '@/db/download/download.repository.ts';
import { ModelFile } from '@/entities/model';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import s from './ModelStoreFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileType;
}

export const ModelStoreFile = memo((props: Props) => {
  const { className, data } = props;
  const { fitsInMemory, isGguf } = data;

  return (
    <ModelFile data={data} className={classNames(s.modelStoreFile, [className])}>
      {isGguf && (
        <div className={classNames(s.memoryFit, [fitsInMemory ? s.recommended : s.tooLarge])}>
          <Text s={14}>{fitsInMemory ? 'Recommended' : 'Too large for this machine'}</Text>
        </div>
      )}
      <Button variant="secondary" className={s.downloadBtn}>
        <Icon svg={DownloadIcon} className={s.downloadIcon} />
        Download
      </Button>
    </ModelFile>
  );
});
