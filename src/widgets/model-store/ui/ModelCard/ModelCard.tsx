import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';
import { HuggingFaceModel } from '@/widgets/model-store/types/hugging-face-model.ts';

import s from './ModelCard.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  model: HuggingFaceModel;
}

export const ModelCard = memo((props: Props) => {
  const { className } = props;

  return <div className={classNames(s.modelCard, [className])}></div>;
});
