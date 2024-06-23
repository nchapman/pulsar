import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useState } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { classNames } from '@/shared/lib/func';
import { MultiSwitch, Text } from '@/shared/ui';

import { $modelStoreState } from '../../model/model-store.model.ts';
import { ModelCard } from '../ModelCard/ModelCard';
import { ModelFile } from '../ModelFile/ModelFile.tsx';
import s from './ModelsDetailsPage.module.scss';

const fileTypeOptions = [
  { label: 'Model Files', value: 'model' },
  { label: 'All Files', value: 'all' },
];

export const ModelsDetailsPage = memo(() => {
  const [fileType, setFileType] = useState(fileTypeOptions[0].value);

  const modelData = useUnit($modelStoreState.currModelData);

  const files = useUnit($modelStoreState.currModelFiles)
    .filter((f) => (fileType === 'model' ? f.isGguf : true))
    .sort((a, b) => {
      if (a.isGguf && !b.isGguf) return 1;
      if (a.isMmproj && !b.isMmproj) return -1;
      return 0;
    });

  if (!modelData) return null;

  return (
    <div className={classNames(s.modelsDetailsPage)}>
      <ModelCard info model={modelData} view="list" />

      <div className={s.header}>
        <Text w="medium" c="primary">
          {files.length} Available files
        </Text>

        <MultiSwitch options={fileTypeOptions} value={fileType} onChange={setFileType} />
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
