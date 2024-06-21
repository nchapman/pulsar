import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { ModelTag } from '@/widgets/model-store/ui/ModelTag/ModelTag.tsx';

import { ModelFile as ModelFileType } from '../../types/hugging-face-model.ts';
import s from './ModelFile.module.scss';

interface Props {
  className?: string;
  data: ModelFileType;
}

function getQuantization(fileName: string) {
  const [res] = fileName.match(/Q\d[-_]\w[-_]?\w?/) || [];

  return res;
}

export const ModelFile = memo((props: Props) => {
  const { className, data } = props;
  const { name, size, fitsInMemory } = data;
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
      <div>
        <div className={classNames(s.memoryFit, [fitsInMemory ? s.recommended : s.tooLarge])}>
          <Text s={14}>{fitsInMemory ? 'Recommended' : 'Too large for this machine'}</Text>
        </div>
      </div>
    </div>
  );
});
