import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useCallback, useRef } from 'preact/hooks';

import { goToStoreSearch } from '@/app/routes';
import GoIcon from '@/shared/assets/icons/arrow-right.svg';
import CrossIcon from '@/shared/assets/icons/close.svg';
import LensIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { useKeyboardListener, useToggle } from '@/shared/lib/hooks';
import { Button, Icon, Input } from '@/shared/ui';
import { modelStoreEvents } from '@/widgets/model-store';
import { $modelStoreState, fetchHFModels } from '@/widgets/model-store/model/model-store.model.ts';

import s from './AgentsSearchInput.module.scss';

interface Props {
  className?: string;
}

const placeholder = 'Search agent';

export const AgentsSearchInput = memo((props: Props) => {
  const { className } = props;

  const value = useUnit($modelStoreState.searchValue);
  const isLoading = useUnit(fetchHFModels.pending);

  const inputRef = useRef<any>();

  const { isOn: isFocused, on: onFocusIn, off: onFocusOut } = useToggle();

  const handleSubmit = useCallback((e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    modelStoreEvents.searchHF();
    goToStoreSearch();
  }, []);

  const handleResetInput = useCallback(() => {
    modelStoreEvents.setSearchValue('');
    inputRef.current.focus();
  }, []);

  useKeyboardListener(handleSubmit, 'Enter');

  return (
    <form onSubmit={handleSubmit} className={classNames(s.agentsSearchInput, [className])}>
      <Icon svg={LensIcon} className={s.icon} />
      <Input
        ref={inputRef}
        onFocusIn={onFocusIn}
        onFocusOut={() => setTimeout(onFocusOut, 100)}
        autofocus
        placeholder={placeholder}
        className={s.input}
        value={value}
        disabled={isLoading}
        onChange={modelStoreEvents.setSearchValue}
      />
      {isFocused && value && (
        <Button
          disabled={isLoading}
          loading={isLoading}
          variant="clear"
          type="submit"
          onClick={handleSubmit}
          className={s.go}
          icon={GoIcon}
        />
      )}
      {!isFocused && value && (
        <Button
          onClick={handleResetInput}
          iconSize={16}
          variant="clear"
          type="button"
          className={s.go}
          icon={CrossIcon}
        />
      )}
    </form>
  );
});
