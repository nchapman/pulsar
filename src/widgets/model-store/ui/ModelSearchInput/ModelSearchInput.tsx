import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';

import GoIcon from '@/shared/assets/icons/arrow-right.svg';
import LensIcon from '@/shared/assets/icons/search.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Input } from '@/shared/ui';

import s from './ModelSearchInput.module.scss';

interface Props {
  className?: string;
}

const placeholder = 'Search for models on Hugging Face';

export const ModelSearchInput = memo((props: Props) => {
  const { className } = props;
  const [value, setValue] = useState('aw ed');

  return (
    <div className={classNames(s.modelSearchInput, [className])}>
      <Icon svg={LensIcon} className={s.icon} />
      <Input placeholder={placeholder} className={s.input} value={value} onChange={setValue} />
      <Button variant="clear" className={s.go} icon={GoIcon} />
    </div>
  );
});
