import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { goToStoreModel } from '@/app/routes';
import { DownloadItem } from '@/db/download';
import { Model } from '@/db/model';
import { modelManager } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';
import { modelStoreEvents } from '@/widgets/model-store';

import WarnIcon from '../../assets/warn.svg';
import s from './DownloadModelSuggestion.module.scss';

interface Props {
  className?: string;
  modelName: string;
  items: DownloadItem[];
}

const info = {
  llm: {
    text: 'To interact with the chat, you need to download the Model File as well. Vision Adapter cannot work without downloaded Model Files.',
    linkText: 'Model File',
  },
  mmp: {
    text: 'We also recommend downloading the Vision Adapter. Vision adapters allow language models to process images as input, extending their capabilities.',
    linkText: 'Vision Adapter',
  },
};

function getType(model: Model, items: DownloadItem[]): 'llm' | 'mmp' | null {
  if (!model) return null;

  const downloadingMmp = items.findIndex((i) => i.type === 'mmp') !== -1;
  const downloadingLlm = items.findIndex((i) => i.type === 'llm') !== -1;

  if (!downloadingLlm && !downloadingMmp) return 'mmp';

  if (!downloadingLlm && downloadingMmp) return 'llm';

  const supportsMmp = !!model.data.mmps.length;
  if (supportsMmp && !downloadingMmp) return 'mmp';

  return null;
}

export const DownloadModelSuggestion = memo((props: Props) => {
  const { className, modelName, items } = props;
  const model = useUnit(modelManager.state.$models)[modelName];
  const type = getType(model, items);

  const openModel = () => {
    modelStoreEvents.openModelDetails(modelName);
    goToStoreModel();
  };

  if (!type) return null;

  function printText(type: keyof typeof info) {
    const { linkText, text } = info[type];
    const [first, ...rest] = text.split(linkText);

    return (
      <Text s={12} className={s.text}>
        {first}
        <span onClick={openModel} className={s.link}>
          {linkText}
        </span>
        {rest.join(linkText)}
      </Text>
    );
  }

  return (
    <div className={classNames(s.downloadModelSuggestion, [className])}>
      <Icon svg={WarnIcon} />
      {printText(type)}
    </div>
  );
});
