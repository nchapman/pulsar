import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { ModelSearchInput } from '@/widgets/model-store/ui/ModelSearchInput/ModelSearchInput.tsx';

import s from './ModelStore.module.scss';

interface Props {
  className?: string;
}

export const ModelStore = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.modelStore, [className])}>
      <Text w="semi" s={36} c="primary">
        Model Store
      </Text>

      <ModelSearchInput className={s.input} />
    </div>
  );
});
