import { memo } from 'preact/compat';

import CheckIcon from '@/shared/assets/icons/check.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import s from './Checkbox.module.scss';

interface CheckboxProps {
  className?: string;
  label?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

export const Checkbox = memo((props: CheckboxProps) => {
  const { className, label, onChange, checked, disabled } = props;

  return (
    // eslint-disable-next-line
    <label className={classNames(s.container, [className])}>
      {label && <Text>{label}</Text>}
      <input
        checked={checked}
        disabled={disabled}
        // @ts-ignore
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
        className={s.checkbox}
      />
      <span className={s.checkmark}>
        <Icon svg={CheckIcon} className={s.icon} />
      </span>
    </label>
  );
});
