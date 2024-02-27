import { FC, memo, SVGProps } from 'preact/compat';
import { classNames } from '@/shared/lib/func';
import s from './Icon.module.scss';

interface IconProps {
  className?: string;
  Svg: FC<SVGProps<SVGSVGElement>>;
  width?: number;
  height?: number;
  size?: number;
  noFill?: boolean;
}

export const Icon = memo((props: IconProps) => {
  const { className, Svg, height, width, size, noFill } = props;

  if (!Svg) return <div style={{ width: width || size, height: height || size }} />;

  return (
    <Svg
      style={{ width: width || size, height: height || size }}
      className={classNames(s.icon, [className], { [s.noFill]: noFill })}
    />
  );
});
