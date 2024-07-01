import { memo } from 'preact/compat';
import Scrollbars from 'react-custom-scrollbars';

import { HuggingFaceModel } from '@/entities/model/types/hugging-face-model.ts';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import { ModelCard } from '../ModelCard/ModelCard.tsx';
import s from './ModelsList.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  models: HuggingFaceModel[];
  withViewSwitch?: boolean;
  title: string;
  icon?: any;
  loading?: boolean;
}

export const ModelsList = memo((props: Props) => {
  const { className, view, models, title, icon, loading, withViewSwitch } = props;

  if (loading) {
    return <Text>Searching...</Text>;
  }

  return (
    <div className={classNames(s.modelsList, [className, s[view]])}>
      <div className={s.header}>
        <div>
          {icon && <Icon svg={icon} className={s.icon} />}
          <Text w="bold" s={20} c="primary">
            {title}
          </Text>
        </div>
        {withViewSwitch && <div className={s.viewSwitch}></div>}
      </div>

      <Scrollbars className={s.list}>
        {models.map((i) => (
          <ModelCard view={view} model={i} />
        ))}
      </Scrollbars>
    </div>
  );
});
