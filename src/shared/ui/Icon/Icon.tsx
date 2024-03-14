import { FC, memo, SVGProps } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './Icon.module.scss';

interface IconProps {
  className?: string;
  svg: FC<SVGProps<SVGSVGElement>> | string;
  width?: number;
  height?: number;
  size?: number;
  noFill?: boolean;
}

export const Icon = memo((props: IconProps) => {
  const { className, height, width, size, noFill } = props;

  if (!props.svg) return <div style={{ width: width || size, height: height || size }} />;

  const Svg = props.svg as FC<SVGProps<SVGSVGElement>>;

  return (
    <Svg
      style={{ width: width || size, height: height || size }}
      className={classNames(s.icon, [className], { [s.noFill]: noFill })}
    />
  );
});
