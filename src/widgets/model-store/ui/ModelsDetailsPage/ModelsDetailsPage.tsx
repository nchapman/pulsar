import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import Scrollbars from 'react-custom-scrollbars';

import { classNames } from '@/shared/lib/func';
import { Text } from '@/shared/ui';
import { $modelStoreState } from '@/widgets/model-store/model/model-store.model.ts';
import { ModelFile } from '@/widgets/model-store/ui/ModelFile/ModelFile.tsx';

import { ModelCard } from '../ModelCard/ModelCard';
import s from './ModelsDetailsPage.module.scss';

interface Props {
  className?: string;
}

export const ModelsDetailsPage = memo((props: Props) => {
  const { className } = props;

  const modelData = useUnit($modelStoreState.currModelData);

  const files = useUnit($modelStoreState.currModelFiles);

  if (!modelData) return null;

  return (
    <div className={classNames(s.modelsDetailsPage, [className])}>
      <ModelCard info model={modelData} view="list" />

      <div className={s.header}>
        <Text w="medium" c="primary">
          {files.length} Available files
        </Text>
      </div>

      <div className={s.fileListWrapper}>
        <Scrollbars className={s.filesList}>
          {files.map((file, idx) => (
            <>
              <ModelFile key={file.name} data={file} />
              {idx !== files.length - 1 && <div className={s.divider} />}
            </>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
});
