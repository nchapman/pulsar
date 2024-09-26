import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Toggle.module.scss';

interface Props {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle = memo((props: Props) => {
  const { className, checked, onChange } = props;

  return (
    <label className={classNames(s.toggle, [className, s.label])}>
      <input
        type="checkbox"
        className={s.input}
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <div className={s.control} />
    </label>
  );
});
