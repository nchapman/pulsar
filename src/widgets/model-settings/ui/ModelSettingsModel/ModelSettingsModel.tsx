import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { $currModelData, openModelsDir } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import FolderIcon from '../../assets/folder.svg';
import s from './ModelSettingsModel.module.scss';

interface Props {
  className?: string;
}

export const ModelSettingsModel = memo((props: Props) => {
  const { className } = props;

  const modelData = useUnit($currModelData);

  return (
    <div className={classNames(s.modelSettingsModel, [className])} onClick={openModelsDir}>
      <Text c="primary" s={16} w="medium">
        {modelData?.name}
      </Text>

      <Icon svg={FolderIcon} className={s.icon} />
    </div>
  );
});
