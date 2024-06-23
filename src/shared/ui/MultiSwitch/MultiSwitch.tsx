import { memo } from 'preact/compat';
import { ReactNode } from 'react';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './MultiSwitch.module.scss';

interface Props {
  className?: string;
  options: { label: ReactNode; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const MultiSwitch = memo((props: Props) => {
  const { className, options, value, onChange } = props;

  return (
    <div className={classNames(s.multiSwitch, [className])}>
      {options.map((i) => (
        <button
          type="button"
          key={i.value}
          className={classNames(s.option, [], {
            [s.active]: value === i.value,
          })}
          onClick={() => onChange(i.value)}
        >
          <Text s={14}>{i.label}</Text>
        </button>
      ))}
    </div>
  );
});
