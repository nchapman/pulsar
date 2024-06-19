import { ModelEntry } from '@huggingface/hub';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import { ModelCard } from '../ModelCard/ModelCard.tsx';
import s from './ModelsList.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  models: ModelEntry[];
  withViewSwitch?: boolean;
  title: string;
  icon?: any;
}

export const ModelsList = memo((props: Props) => {
  const { className, view, models, title, icon } = props;

  console.log(models);

  return (
    <div className={classNames(s.modelsList, [className, s[view]])}>
      <div className={s.header}>
        <div>
          {icon && <Icon svg={icon} className={s.icon} />}
          <Text w="semi" s={36} c="primary">
            {title}
          </Text>
        </div>
      </div>

      <div className={s.list}>
        {models.map((i) => (
          <ModelCard view={view} model={i} />
        ))}
      </div>
    </div>
  );
});
