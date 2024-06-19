import { ModelEntry } from '@huggingface/hub';
import { memo } from 'preact/compat';

import { classNames } from '@/shared/lib/func';

import s from './ModelCard.module.scss';

interface Props {
  className?: string;
  view: 'grid' | 'list';
  model: ModelEntry;
}

export const ModelCard = memo((props: Props) => {
  const { className, model } = props;

  const { name } = model;

  return <div className={classNames(s.modelCard, [className])}>{name}</div>;
});
