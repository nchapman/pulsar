import { memo } from 'preact/compat';

import DownloadIcon from '@/shared/assets/icons/download.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import { getQuantization } from '../../lib/getQuantization.ts';
import { ModelFile as ModelFileType } from '../../types/hugging-face-model.ts';
import { ModelTag } from '../ModelTag/ModelTag.tsx';
import s from './ModelFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileType;
}

export const ModelFile = memo((props: Props) => {
  const { className, data } = props;
  const { name, size, fitsInMemory, isGguf } = data;
  const quantization = getQuantization(name);

  return (
    <div className={classNames(s.modelFile, [className])}>
      <div>
        <Text c="primary" w="medium" s={16} className={s.fileName}>
          {name}
        </Text>

        <div className={s.tags}>
          <ModelTag data={{ value: size, type: 'size' }} />

          {quantization && <ModelTag data={{ value: quantization, type: 'quantization' }} />}
        </div>
      </div>
      <div className={s.rightSide}>
        {isGguf && (
          <div className={classNames(s.memoryFit, [fitsInMemory ? s.recommended : s.tooLarge])}>
            <Text s={14}>{fitsInMemory ? 'Recommended' : 'Too large for this machine'}</Text>
          </div>
        )}
        <Button variant="secondary" className={s.downloadBtn}>
          <Icon svg={DownloadIcon} className={s.downloadIcon} />
          Download
        </Button>
      </div>
    </div>
  );
});
