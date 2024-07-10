import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Badge, Card, Text } from '@/shared/ui';

import s from './ModelCard.module.scss';

interface Props {
  className?: string;
  modelData: { name: string; desc: string; size: string };
}

export const ModelCard = memo((props: Props) => {
  const { className, modelData } = props;
  const { name, desc, size } = modelData;

  return (
    <Card type="secondary" size="s" className={classNames(s.modelCard, [className])}>
      <div>
        <Text c="primary" w="semi">
          {name}
        </Text>
      </div>
      <Text s={14} className={s.desc}>
        {desc}
      </Text>
      <div className={s.tags}>
        <Badge bg="#38665E" content="Recommended" />
        <Badge bg="#424242" content={size} prefix="Size" />
      </div>
    </Card>
  );
});
