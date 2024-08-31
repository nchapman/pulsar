import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { ModelFileData } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { MultiSwitch, Text } from '@/shared/ui';

import { $modelStoreState } from '../../model/model-store.model.ts';
import { MmpHint } from '../MmpHint/MmpHint.tsx';
import { ModelCard } from '../ModelCard/ModelCard';
import { ModelStoreFile } from '../ModelStoreFile/ModelStoreFile.tsx';
import s from './ModelsDetailsPage.module.scss';

const fileTypeOptions = [
  { label: 'Model Files', value: 'model' },
  { label: 'All Files', value: 'all' },
];

function processModelFiles(files: ModelFileData[], fileType: string) {
  return files
    .filter((f) => (fileType === 'model' ? f.isGguf : true))
    .sort((a, b) => {
      if (!a.isGguf && b.isGguf) return -1;
      if (a.isMmproj && !b.isMmproj) return -1;
      return 0;
    });
}

export const ModelsDetailsPage = memo(() => {
  const [fileType, setFileType] = useState(fileTypeOptions[0].value);

  const modelData = useUnit($modelStoreState.currModelData);

  const files = useUnit($modelStoreState.currModelFiles);

  const withVision = files.some((f) => f.isMmproj);

  const modelsToShow = useMemo(() => processModelFiles(files, fileType), [fileType, files]);

  if (!modelData) return null;

  return (
    <div className={classNames(s.modelsDetailsPage)}>
      <ModelCard info model={modelData} view="list" withVision={withVision} />

      {withVision && <MmpHint className={s.hint} />}

      <div className={s.header}>
        <Text w="medium" c="primary">
          {modelsToShow.length ? `${modelsToShow.length} Available files` : 'No files available'}
        </Text>

        <MultiSwitch options={fileTypeOptions} value={fileType} onChange={setFileType} />
      </div>

      <div className={s.fileListWrapper}>
        <Scrollbars className={s.filesList}>
          {modelsToShow.map((file, idx) => (
            <>
              <ModelStoreFile key={file.name} data={file} />
              {idx !== modelsToShow.length - 1 && <div className={s.divider} />}
            </>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
});
