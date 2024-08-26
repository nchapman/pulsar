import { memo, ReactNode } from 'preact/compat';

import InfoIcon from '@/shared/assets/icons/info-circle.svg';
import { bytesToSize, classNames } from '@/shared/lib/func';
import { Icon, Text, Tooltip } from '@/shared/ui';

import { getQuantizationInfo } from '../../lib/getQuantizationInfo.ts';
import { ModelTagType, Tag } from '../../types/tag.type.ts';
import s from './ModelTag.module.scss';

interface Props {
  className?: string;
  data: Tag;
  isDownloads?: boolean;
}

const meta: OptionalRecord<
  ModelTagType,
  {
    prefix?: ReactNode;
    suffix?: (val: any) => ReactNode;
    formatter?: (val: any) => any;
    tagClass?: (val: any) => string;
  }
> = {
  size: { prefix: 'Size:', formatter: bytesToSize },
  quantization: {
    suffix: (val) => (
      <Tooltip text={getQuantizationInfo(val)}>
        <Icon className={s.infoIcon} svg={InfoIcon} />
      </Tooltip>
    ),
    tagClass: (val: string) => val.split(/[-_]/)[0]?.toLowerCase(),
  },
  vision: { formatter: () => 'Vision Adapter' },
  hasVision: { formatter: () => 'Has Vision Adapter' },
  model: { formatter: () => 'Model File' },
  other: { formatter: () => 'Other' },
};

export const ModelTag = memo((props: Props) => {
  const {
    className,
    data: { type, value },
    isDownloads,
  } = props;

  const { formatter, prefix, suffix, tagClass } = meta[type] || {};

  return (
    <div
      className={classNames(s.modelTag, [className, s[type], s[tagClass?.(value) || '']], {
        [s.downloads]: isDownloads,
      })}
    >
      {prefix && <Text s={12}>{prefix}</Text>}

      <Text s={12} w="medium" c="primary">
        {formatter ? formatter(value) : value}
      </Text>
      {suffix && suffix(value)}
    </div>
  );
});
