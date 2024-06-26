import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import { $modelStoreState, fetchHFModels } from '../../model/model-store.model.ts';
import { CuratedModels } from '../CuratedModels/CuratedModels.tsx';
import { ModelSearchInput } from '../ModelSearchInput/ModelSearchInput.tsx';
import { ModelsList } from '../ModelsList/ModelsList.tsx';
import s from './ModelsSearchPage.module.scss';

export const ModelsSearchPage = memo(() => {
  const searchedModels = useUnit($modelStoreState.models);
  const showCurated = useUnit($modelStoreState.showCurated);
  const isLoading = useUnit(fetchHFModels.pending);

  return (
    <div className={classNames(s.modelsSearchPage)}>
      <Text w="semi" s={36} c="primary">
        Model Store
      </Text>

      <ModelSearchInput className={s.input} />

      {showCurated ? (
        <CuratedModels />
      ) : (
        <ModelsList
          loading={isLoading}
          view="list"
          models={searchedModels}
          title={`${searchedModels.length} results from Hugging Face`}
        />
      )}
    </div>
  );
});
