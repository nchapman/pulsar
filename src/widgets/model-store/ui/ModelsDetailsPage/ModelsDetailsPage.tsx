import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useMemo, useState } from 'preact/hooks';
import Scrollbars from 'react-custom-scrollbars';

import { ModelFileType } from '@/db/download/download.repository.ts';
import { classNames } from '@/shared/lib/func';
import { MultiSwitch, Text } from '@/shared/ui';
import { ModelStoreFile } from '@/widgets/model-store/ui/ModelStoreFile/ModelStoreFile.tsx';

import { $modelStoreState } from '../../model/model-store.model.ts';
import { ModelCard } from '../ModelCard/ModelCard';
import s from './ModelsDetailsPage.module.scss';

const fileTypeOptions = [
  { label: 'Model Files', value: 'model' },
  { label: 'All Files', value: 'all' },
];

function processModelFiles(files: ModelFileType[], fileType: string) {
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

  const modelsToShow = useMemo(() => processModelFiles(files, fileType), [fileType, files]);

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
          {modelsToShow.map((file, idx) => (
            <>
              <ModelStoreFile key={file.name} data={file} />
              {idx !== files.length - 1 && <div className={s.divider} />}
            </>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
});
