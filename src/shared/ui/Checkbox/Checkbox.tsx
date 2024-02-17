import { memo } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import CheckIcon from '@/shared/assets/icons/check.svg';
import cls from './Checkbox.module.scss';

interface CheckboxProps {
  className?: string;
  label: string;
  onChange: (value: string, checked: boolean) => void;
  checked: boolean;
  value: string;
}

export const Checkbox = memo((props: CheckboxProps) => {
  const { className, label, onChange, checked, value } = props;

  return (
    // eslint-disable-next-line
    <label className={classNames(cls.container, [className])}>
      <Text type="body-2">{label}</Text>
      <input
        checked={checked}
        // @ts-ignore
        onChange={(e) => onChange(value, e.target.checked)}
        type="checkbox"
        className={cls.checkbox}
      />
      <span className={cls.checkmark}>
        {/* @ts-ignore */}
        <CheckIcon className={cls.icon} />
      </span>
    </label>
  );
});