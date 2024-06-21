import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import { Tag } from '../../types/tag.type.ts';
import s from './ModelTag.module.scss';

interface Props {
  className?: string;
  data: Tag;
}

export const ModelTag = memo((props: Props) => {
  const {
    className,
    data: { type, value },
  } = props;

  return (
    <div className={classNames(s.modelTag, [className, s[type]])}>
      <Text s={12} w="medium" c="primary">
        {value}
      </Text>
    </div>
  );
});
