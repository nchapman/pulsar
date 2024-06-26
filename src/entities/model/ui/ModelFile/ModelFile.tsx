import { memo, ReactNode } from 'preact/compat';

import { ModelFileType } from '@/db/download/download.repository.ts';
import { getQuantization } from '@/entities/model/lib/getQuantization.ts';
import { ModelTag } from '@/entities/model/ui/ModelTag/ModelTag.tsx';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './ModelFile.module.scss';

interface Props {
  className?: string;
  children: ReactNode;
  data: ModelFileType;
}

export const ModelFile = memo((props: Props) => {
  const { className, children, data } = props;
  const { name, size } = data;
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
      <div className={s.rightSide}>{children}</div>
    </div>
  );
});
