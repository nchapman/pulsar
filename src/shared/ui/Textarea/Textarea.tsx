import { Ref } from 'preact';
import { ChangeEvent, ForwardedRef, forwardRef, memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Textarea.module.scss';

// @ts-ignore
// eslint-disable-next-line no-undef
type TI = TextareaHTMLAttributes<HTMLTextAreaElement>;

type HTMLTextareaProps = Omit<TI, 'value' | 'onChange'>;

interface TextareaProps extends HTMLTextareaProps {
  className?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  autofocus?: boolean;
}

const Textarea = forwardRef((props: TextareaProps, ref?: ForwardedRef<HTMLInputElement>) => {
  const { value, onChange, autofocus, className, ...otherProps } = props;
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // @ts-ignore
    onChange?.(e.target.value);
  };

  return (
    <textarea
      autoFocus={autofocus}
      ref={ref as Ref<HTMLTextAreaElement>}
      {...otherProps}
      value={value ?? ''}
      onChange={handleChange}
      className={classNames(s.textarea, [className])}
    />
  );
});

const MemoizedTextarea = memo(Textarea);

export { MemoizedTextarea as Textarea };
