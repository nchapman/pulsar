import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Logo, Text } from '@/shared/ui';
import { curatedModels } from '@/widgets/model-store/consts/curated-model.ts';
import { CuratedModelCard } from '@/widgets/model-store/ui/CuratedModelCard/CuratedModelCard.tsx';

import s from './CuratedModels.module.scss';

interface Props {
  className?: string;
}

export const CuratedModels = memo((props: Props) => {
  const { className } = props;

  return (
    <div className={classNames(s.curatedModels, [className])}>
      <div className={s.header}>
        <Logo size="s" />
        <Text s={20} w="bold" c="primary">
          Popular Models
        </Text>
      </div>

      <div className={s.list}>
        {[...curatedModels, ...curatedModels, ...curatedModels, ...curatedModels].map((i) => (
          <CuratedModelCard className={s.item} data={i} key={i.name} />
        ))}
      </div>
    </div>
  );
});
