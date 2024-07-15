import { FC, memo, ReactNode, SVGProps } from 'preact/compat';
import { Popover } from 'react-tiny-popover';

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import { classNames } from '@/shared/lib/func';
import { useToggle } from '@/shared/lib/hooks';
import { Button, Icon } from '@/shared/ui';

import s from './Select.module.scss';

interface SelectProps {
  className?: string;
  options: { value: string; label: ReactNode; icon?: FC<SVGProps<SVGSVGElement>> | string }[];
  defaultValue?: string;
  value?: string;
  onChange: (value: string) => void;
  firstDisabled?: boolean;
  popoverClassName?: string;
  optionClassName?: string;
  type?: 'secondary' | 'clear';
}

export const Select = memo((props: SelectProps) => {
  const {
    className,
    options,
    onChange,
    value,
    optionClassName,
    popoverClassName,
    type = 'clear',
  } = props;
  const { toggle, isOn, off } = useToggle();

  const content = (
    <div className={classNames(s.popover, [popoverClassName])}>
      {options.map((option) => (
        <Button
          key={option.value}
          className={classNames(s.option, [optionClassName])}
          variant="clear"
          onClick={() => {
            onChange(option.value);
            toggle();
          }}
        >
          {option.icon && <Icon svg={option.icon} />}

          {option.label}
        </Button>
      ))}
    </div>
  );

  return (
    <Popover
      isOpen={isOn}
      positions={['bottom', 'top']}
      content={content}
      align="start"
      padding={4}
      onClickOutside={off}
    >
      <div>
        <Button
          className={classNames(s.select, [className, s[type]])}
          onClick={toggle}
          variant="clear"
        >
          {options.find((o) => o.value === value)?.label || options[0].label}
          <Icon svg={ChevronDownIcon} />
        </Button>
      </div>
    </Popover>
  );
});
