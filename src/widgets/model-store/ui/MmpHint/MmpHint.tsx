/* eslint-disable react/no-unescaped-entities */
import { memo } from 'preact/compat';

import { ModelTag } from '@/entities/model/ui/ModelTag/ModelTag.tsx';
import { classNames } from '@/shared/lib/func';
import { Collapsible, Icon, Text } from '@/shared/ui';
import WarnIcon from '@/widgets/downloads/assets/warn.svg';

import s from './MmpHint.module.scss';

interface Props {
  className?: string;
}

export const MmpHint = memo((props: Props) => {
  const { className } = props;

  return (
    <Collapsible
      className={classNames(s.mmpHint, [className])}
      expandedClassName={s.hintExpanded}
      wholeClickable
      head={
        <Text s={12} w="medium">
          How do I use <span className={s.hintHighlight}>vision-enabled models</span>?
        </Text>
      }
    >
      <div className={s.body}>
        <Text s={12} c="primary">
          Models with vision capabilities are identified by the presence of a 'mmproj-' (MultiModal
          Projector) file in the repository, indicating that a vision adapter is available. Vision
          adapters enable language models to process images as input, enhancing their capabilities.
        </Text>
        <Text s={12} c="primary">
          One primary model file, which can be recognized by the{' '}
          <ModelTag className={s.tag} data={{ type: 'model' }} /> badge.
        </Text>
        <Text s={12} c="primary">
          One vision adapter file <ModelTag className={s.tag} data={{ type: 'vision' }} />
          ,which allows the primary model to handle image inputs.
        </Text>
        <Text s={12} c="primary">
          Once both files are downloaded, Pulsar will automatically link them together, and you will
          notice a corresponding badge in the model loader indicating their association.
        </Text>

        <div className={s.warn}>
          <Icon svg={WarnIcon} />
          <Text s={12} className={s.text}>
            Keep in mind that local vision models are at an early stage of development and their
            performance may be limited.
          </Text>
        </div>
      </div>
    </Collapsible>
  );
});
