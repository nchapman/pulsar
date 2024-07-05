import { memo } from 'preact/compat';

import { LlmName, supportedLlms } from '@/entities/model/consts/supported-llms.const.ts';
import { classNames } from '@/shared/lib/func';
import { Badge, Card, Text } from '@/shared/ui';

import s from './ModelCard.module.scss';

interface Props {
  className?: string;
  model: LlmName;
}

export const ModelCard = memo((props: Props) => {
  const { className, model } = props;
  const { name, desc, size } = supportedLlms[model];

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
