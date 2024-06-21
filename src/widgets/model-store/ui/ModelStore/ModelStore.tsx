import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import { $modelStoreState } from '../../model/model-store.model.ts';
import { ModelsDetailsPage } from '../ModelsDetailsPage/ModelsDetailsPage.tsx';
import { ModelsSearchPage } from '../ModelsSearchPage/ModelsSearchPage.tsx';
import s from './ModelStore.module.scss';

interface Props {
  className?: string;
}

const $isDetailsOpen = $modelStoreState.currModel.map((model) => !!model);

export const ModelStore = memo((props: Props) => {
  const { className } = props;

  const isDetailsOpen = useUnit($isDetailsOpen);

  return (
    <div className={classNames(s.modelStore, [className])}>
      {isDetailsOpen ? <ModelsDetailsPage /> : <ModelsSearchPage />}
    </div>
  );
});
