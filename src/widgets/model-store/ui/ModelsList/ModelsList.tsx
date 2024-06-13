import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import { HuggingFaceModel } from '../../types/hugging-face-model.ts';
import { ModelCard } from '../ModelCard/ModelCard.tsx';
import s from './ModelsList.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  models: HuggingFaceModel[];
  withViewSwitch?: boolean;
  title: string;
  icon: any;
}

export const ModelsList = memo((props: Props) => {
  const { className, view, models, title, icon } = props;

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
