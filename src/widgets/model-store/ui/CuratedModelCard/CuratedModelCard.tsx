import { memo } from 'preact/compat';

import { getTagsFromName } from '@/entities/model/lib/getTagsFromName.ts';
import { CuratedModel } from '@/entities/model/types/hugging-face-model.ts';
import { ModelTag } from '@/entities/model/ui/ModelTag/ModelTag.tsx';
import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';

import s from './CuratedModelCard.module.scss';

interface Props {
  className?: string;
  data: CuratedModel;
}

export const CuratedModelCard = memo((props: Props) => {
  const { className, data } = props;

  return (
    <div className={classNames(s.curatedModelCard, [className])}>
      <div className={s.tags}>
        {getTagsFromName(data.name).map((tag) => (
          <ModelTag key={tag.value} data={tag} />
        ))}
      </div>
      <div className={s.header}>
        <Text w="semi" s={16} c="primary">
          {data.name}
        </Text>
      </div>
      <Text s={14}>{data.description}</Text>
      <Text s={12}>Published by {data.author} on Hugging Face</Text>
    </div>
  );
});
