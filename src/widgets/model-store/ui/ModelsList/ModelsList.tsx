import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { classNames } from '@/shared/lib/func';
import { Icon, Select, Text } from '@/shared/ui';
import { ScrollArea } from '@/shared/ui/ScrollArea/ScrollArea.tsx';
import {
  $modelStoreState,
  modelStoreEvents,
} from '@/widgets/model-store/model/model-store.model.ts';

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
  all?: boolean;
}

const optionsArr = [
  ModelSorting.MOST_DOWNLOADS,
  ModelSorting.MOST_LIKES,
  ModelSorting.LEAST_RECENT,
  ModelSorting.MOST_RECENT,
].map((i) => ({
  label: ModelSortingData[i].label,
  value: ModelSortingData[i].value,
}));

export const ModelsList = memo((props: Props) => {
  const { className, all, view, models, title, icon, loading } = props;

  const sorting = useUnit($modelStoreState.modelSorting);

  const handleScroll = (e: any) => {
    if (all) return;
    modelStoreEvents.setListScroll(e.target.scrollTop);
  };

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

      <ScrollArea
        onScroll={handleScroll}
        height={all ? '400px' : 'calc(100vh - 364px)'}
        className={s.list}
        initialScroll={$modelStoreState.listScroll.getState()}
      >
        {loading ? (
          <Text className={s.searching}>Searching...</Text>
        ) : (
          models.map((i) => <ModelCard view={view} model={i} />)
        )}
      </ScrollArea>
    </div>
  );
});
