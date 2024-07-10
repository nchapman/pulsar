import { memo } from 'preact/compat';

import { ModelFile, ModelFileData } from '@/entities/model';
import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import { startFileDownload } from '../../lib/startFileDownload.ts';
import s from './ModelStoreFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileData;
}

export const ModelStoreFile = memo((props: Props) => {
  const { className, data } = props;
  const { fitsInMemory, isGguf } = data;

  const handleDownload = () => startFileDownload(data);

  return (
    <ModelFile data={data} className={classNames(s.modelStoreFile, [className])}>
      {isGguf && (
        <div className={classNames(s.memoryFit, [fitsInMemory ? s.recommended : s.tooLarge])}>
          <Text s={14}>{fitsInMemory ? 'Recommended' : 'Too large for this machine'}</Text>
        </div>
      )}
      <Button variant="secondary" className={s.downloadBtn} onClick={handleDownload}>
        <Icon svg={DownloadIcon} className={s.downloadIcon} />
        Download
      </Button>
    </ModelFile>
  );
});
