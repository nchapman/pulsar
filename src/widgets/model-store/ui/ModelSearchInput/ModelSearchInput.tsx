import { memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import GoIcon from '@/shared/assets/icons/arrow-right.svg';
import LensIcon from '@/shared/assets/icons/search.svg';
import { classNames, debounce } from '@/shared/lib/func';
import { Button, Icon, Input } from '@/shared/ui';

import { modelStoreEvents } from '../../model/model-store.model.ts';
import s from './ModelSearchInput.module.scss';

interface Props {
  className?: string;
}

const placeholder = 'Search for models on Hugging Face';

const [debouncedSearch, clearFn] = debounce(modelStoreEvents.searchHF, 400);

export const ModelSearchInput = memo((props: Props) => {
  const { className } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value && value.length < 4) return undefined;
    debouncedSearch(value);

    return clearFn;
  }, [value]);

  return (
    <div className={classNames(s.modelSearchInput, [className])}>
      <Icon svg={LensIcon} className={s.icon} />
      <Input
        autofocus
        placeholder={placeholder}
        className={s.input}
        value={value}
        onChange={setValue}
      />
      <Button variant="clear" className={s.go} icon={GoIcon} />
    </div>
  );
});
