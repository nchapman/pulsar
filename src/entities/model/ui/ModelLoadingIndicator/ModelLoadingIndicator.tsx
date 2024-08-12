import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { modelManager } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import { $currModelData } from '../../model/model.model.ts';
import s from './ModelLoadingIndicator.module.scss';

interface Props {
  className?: string;
}

export const ModelLoadingIndicator = memo((props: Props) => {
  const { className } = props;

  const modelLoadingProgress = useUnit(modelManager.state.$loadingProgress);
  const modelData = useUnit($currModelData);

  return (
    <div className={classNames(s.modelLoadingIndicator, [className])}>
      <Text s={12} w="medium">
        Model is loading
      </Text>
      <Text className={s.modelName} s={14} w="medium" c="primary">
        {modelData?.name}
      </Text>

      <div className={s.progress}>
        <div className={s.inner} style={{ width: `${modelLoadingProgress * 100}%` }} />
      </div>
    </div>
  );
});
