import { useUnit } from 'effector-react';
import { memo, useLayoutEffect } from 'preact/compat';

import { goToStoreModel } from '@/app/routes';
import ListIcon from '@/shared/assets/icons/list.svg';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';

import { $modelStoreState, fetchHFModels } from '../../model/model-store.model.ts';
import { CuratedModels } from '../CuratedModels/CuratedModels.tsx';
import { ModelSearchInput } from '../ModelSearchInput/ModelSearchInput.tsx';
import { ModelsList } from '../ModelsList/ModelsList.tsx';
import s from './ModelsSearchPage.module.scss';

export const ModelsSearchPage = memo(() => {
  const searchedModels = useUnit($modelStoreState.models);
  const showCurated = useUnit($modelStoreState.showCurated);
  const isLoading = useUnit(fetchHFModels.pending);

  useLayoutEffect(() => {
    if ($modelStoreState.currModel.getState()) {
      goToStoreModel();
    }
  }, []);

  return (
    <ScrollArea height="100vh" className={classNames(s.modelsSearchPage)}>
      <Text w="semi" s={36} c="primary">
        Model Store
      </Text>

      <ModelSearchInput className={s.input} />

      {showCurated && <CuratedModels className={s.curated} />}

      <ModelsList
        loading={isLoading}
        view="list"
        models={searchedModels}
        icon={showCurated ? ListIcon : undefined}
        title={showCurated ? 'All models' : `${searchedModels.length} results from Hugging Face`}
      />
    </ScrollArea>
  );
});
