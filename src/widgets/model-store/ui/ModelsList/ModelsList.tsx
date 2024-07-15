import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import Scrollbars from 'react-custom-scrollbars';

import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { classNames } from '@/shared/lib/func';
import { Icon, Select, Text } from '@/shared/ui';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';

import { ModelSorting, ModelSortingData } from '../../types/model-sorting.ts';
import { ModelCard } from '../ModelCard/ModelCard.tsx';
import s from './ModelsList.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  models: HuggingFaceModel[];
  withViewSwitch?: boolean;
  title: string;
  icon?: any;
  loading?: boolean;
  sorting?: ModelSorting;
  onSortingChange?: (sorting: ModelSorting) => void;
}

const optionsArr = [
  ModelSorting.MOST_RECENT,
  ModelSorting.LEAST_RECENT,
  ModelSorting.MOST_DOWNLOADS,
  ModelSorting.MOST_LIKES,
].map((i) => ({
  label: ModelSortingData[i].label,
  value: ModelSortingData[i].value,
}));

export const ModelsList = memo((props: Props) => {
  const { className, view, models, title, icon, loading } = props;

  const sorting = useUnit($modelStoreState.modelSorting);

  if (loading) {
    return <Text>Searching...</Text>;
  }

  return (
    <div className={classNames(s.modelsList, [className, s[view]])}>
      <div className={s.header}>
        <div className={s.title}>
          {icon && <Icon svg={icon} className={s.icon} />}
          <Text w="bold" s={20} c="primary">
            {title}
          </Text>
        </div>
        <Select
          type="secondary"
          options={optionsArr}
          value={sorting}
          onChange={(v) => $modelStoreState.setModelSorting(v as ModelSorting)}
        />
      </div>

      <div className={s.listWrapper}>
        <Scrollbars className={s.list}>
          {models.map((i) => (
            <ModelCard view={view} model={i} />
          ))}
        </Scrollbars>
      </div>
    </div>
  );
});
