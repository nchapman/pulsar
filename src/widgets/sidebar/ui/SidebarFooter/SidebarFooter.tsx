import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';

import {
  fetchHuggingFaceModel,
  searchHuggingFaceModel,
} from '@/features/hugging-face-search/hugging-face-search';
import { classNames } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger';
import { Button } from '@/shared/ui';
import { openSettingsModal, SettingsModal } from '@/widgets/settings';

import s from './SidebarFooter.module.scss';

interface Props {
  className?: string;
}

export const SidebarFooter = memo((props: Props) => {
  const { className } = props;

  const openAppData = async () => {
    const appDataDirPath = await appDataDir();
    openPath(appDataDirPath);
  };

  return (
    <div className={classNames(s.sidebarFooter, [className])}>
      {/* @ts-ignore */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <Button className={s.btn} onClick={openAppData} variant="clear">
            Open App Data
          </Button>
          <Button
            className={s.btn}
            onClick={async () => {
              const searchResults = await searchHuggingFaceModel('cjpais');

              const model = await fetchHuggingFaceModel(searchResults[0].modelId);

              logi('Hugging face model', JSON.stringify(model, null, 2));
            }}
            variant="clear"
          >
            Hugging face test
          </Button>
        </>
      )}

      <Button className={s.btn} onClick={openSettingsModal} variant="secondary">
        Settings
      </Button>

      <SettingsModal />
    </div>
  );
});
