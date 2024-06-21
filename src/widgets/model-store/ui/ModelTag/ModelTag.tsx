import { memo, ReactNode } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import { ModelTagType, Tag } from '../../types/tag.type.ts';
import s from './ModelTag.module.scss';

interface Props {
  className?: string;
  data: Tag;
}

const meta: OptionalRecord<ModelTagType, { prefix?: ReactNode; suffix?: ReactNode }> = {
  size: { prefix: 'Size:' },
};

export const ModelTag = memo((props: Props) => {
  const {
    className,
    data: { type, value },
  } = props;

  const prefix = meta[type]?.prefix;

  return (
    <div className={classNames(s.modelTag, [className, s[type]])}>
      {prefix && <Text s={12}>{prefix}</Text>}
      <Text s={12} w="medium" c="primary">
        {value}
      </Text>
    </div>
  );
});
