import { memo } from 'preact/compat';

import { getTagsFromName } from '@/entities/model/lib/getTagsFromName.ts';
import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { ModelTag } from '@/entities/model/ui/ModelTag/ModelTag.tsx';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import UpdateIcon from '../../assets/clock-check.svg';
import DownloadIcon from '../../assets/download.svg';
import LikeIcon from '../../assets/heart.svg';
import { formatDate } from '../../lib/formatDate';
import { formatNumber } from '../../lib/formatNumber.ts';
import { modelStoreEvents } from '../../model/model-store.model.ts';
import s from './ModelCard.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  model: HuggingFaceModel;
  info?: boolean;
}

export const ModelCard = memo((props: Props) => {
  const { className, model, info } = props;

  const { name } = model;

  const stats = [
    {
      label: `${formatNumber(model.downloadsAllTime)} Plus`,
      icon: DownloadIcon,
    },
    {
      label: `${formatNumber(model.downloads)} Likes`,
      icon: LikeIcon,
    },
    {
      label: `Updated ${formatDate(model.updatedAt)}`,
      icon: UpdateIcon,
    },
  ];

  const handeClick = () => {
    if (info) return;
    modelStoreEvents.openModelDetails(model.name);
  };

  return (
    <div className={classNames(s.modelCard, [className], { [s.info]: info })} onClick={handeClick}>
      <div>
        <Text className={s.name} s={20} w="medium" c="primary">
          {name}
        </Text>

        <div className={s.meta}>
          {stats.map((i) => (
            <div className={s.stat}>
              <Icon className={s.icon} svg={i.icon} />
              <Text s={14} c="tertiary">
                {i.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div className={s.right}>
        <div className={s.tags}>
          {getTagsFromName(name).map((tag) => (
            <ModelTag key={tag.value} data={tag} />
          ))}
        </div>
        <div className={s.publisher}>
          <Text s={12}>Published by {model.author} on Hugging Face</Text>
        </div>
      </div>
    </div>
  );
});
