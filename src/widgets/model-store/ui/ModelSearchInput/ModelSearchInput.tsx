import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';

import GoIcon from '@/shared/assets/icons/arrow-right.svg';
import LensIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Input } from '@/shared/ui';

import {
  $modelStoreState,
  fetchHFModels,
  modelStoreEvents,
} from '../../model/model-store.model.ts';
import s from './ModelSearchInput.module.scss';

interface Props {
  className?: string;
}

const placeholder = 'Search for models on Hugging Face';

export const ModelSearchInput = memo((props: Props) => {
  const { className } = props;
  const value = useUnit($modelStoreState.searchValue);
  const isLoading = useUnit(fetchHFModels.pending);

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault();
    modelStoreEvents.searchHF();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classNames(s.modelSearchInput, [className])}>
      <Icon svg={LensIcon} className={s.icon} />
      <Input
        autofocus
        placeholder={placeholder}
        className={s.input}
        value={value}
        disabled={isLoading}
        onChange={modelStoreEvents.setSearchValue}
      />
      <Button
        disabled={isLoading}
        loading={isLoading}
        variant="clear"
        type="submit"
        className={s.go}
        icon={GoIcon}
      />
    </form>
  );
});
