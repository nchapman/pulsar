import { ChangeEvent, memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';

import { classNames } from '@/shared/lib/func';

import s from './Select.module.scss';

interface SelectProps {
  className?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  firstDisabled?: boolean;
}

export const Select = memo((props: SelectProps) => {
  const { className, options, onChange, value, defaultValue, firstDisabled } = props;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      // @ts-ignore
      onChange?.(e.target?.value);
    },
    [onChange]
  );

  return (
    <div className={classNames(s.wrapper, [className])}>
      <select
        value={value}
        onChange={handleChange}
        defaultValue={defaultValue}
        className={s.select}
      >
        {options.map((option, idx) => (
          <option disabled={idx === 0 && firstDisabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
