import { memo } from 'preact/compat';
import Scrollbars from 'react-custom-scrollbars';

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
  icon?: any;
}

export const ModelsList = memo((props: Props) => {
  const { className, view, models, title, icon } = props;

  return (
    <Scrollbars className={classNames(s.modelsList, [className, s[view]])}>
      <div className={s.header}>
        <div>
          {icon && <Icon svg={icon} className={s.icon} />}
          <Text w="bold" s={20} c="primary">
            {title}
          </Text>
        </div>
      </div>

      <div className={s.list}>
        {models.map((i) => (
          <ModelCard view={view} model={i} />
        ))}
      </div>
    </Scrollbars>
  );
});
