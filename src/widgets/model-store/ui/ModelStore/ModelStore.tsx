import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';
import { ModelsList } from '@/widgets/model-store/ui/ModelsList/ModelsList.tsx';

import { ModelSearchInput } from '../ModelSearchInput/ModelSearchInput.tsx';
import s from './ModelStore.module.scss';

interface Props {
  className?: string;
}

export const ModelStore = memo((props: Props) => {
  const { className } = props;

  const searchedModels = useUnit($modelStoreState.models);

  return (
    <div className={classNames(s.modelStore, [className])}>
      <Text w="semi" s={36} c="primary">
        Model Store
      </Text>

      <ModelSearchInput className={s.input} />

      <ModelsList
        view="list"
        models={searchedModels}
        title={`${searchedModels.length} results from Hugging Face`}
      />
    </div>
  );
});
