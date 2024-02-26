import { ChangeEvent, ForwardedRef, forwardRef, memo } from 'preact/compat';
import { Ref } from 'preact';
import { classNames } from '@/shared/lib/func';
import s from './Input.module.scss';

// @ts-ignore
// eslint-disable-next-line no-undef
type TI = InputHTMLAttributes<HTMLInputElement>;

type HTMLInputProps = Omit<TI, 'value' | 'onChange'>;

interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  autofocus?: boolean;
  // eslint-disable-next-line no-undef
  type?: string;
}

const Input = forwardRef((props: InputProps, ref?: ForwardedRef<HTMLInputElement>) => {
  const { value, onChange, type = 'text', autofocus, className, ...otherProps } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    onChange?.(e.target.value);
  };

  return (
    <input
      autoFocus={autofocus}
      ref={ref as Ref<HTMLInputElement>}
      type={type}
      {...otherProps}
      value={value ?? ''}
      onChange={handleChange}
      className={classNames(s.input, [className])}
    />
  );
});

const MemoizedInput = memo(Input);

export { MemoizedInput as Input };
