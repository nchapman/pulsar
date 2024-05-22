import { invoke } from '@tauri-apps/api';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';
import {
  fetchHuggingFaceFiles,
  searchHuggingFaceModel,
} from '@/features/hugging-face-search/HuggingFaceSearch';
import { classNames } from '@/shared/lib/func';
import { logi } from '@/shared/lib/Logger';
import { Button } from '@/shared/ui';
import { openSettingsModal, SettingsModal } from '@/widgets/settings';

import s from './SidebarFooter.module.scss';
import { getSystemInfo } from '@/features/system/system';

interface Props {
  className?: string;
}

export const SidebarFooter = memo((props: Props) => {
  const { className } = props;

  const openAppData = async () => {
    const appDataDirPath = await appDataDir();
    openPath(appDataDirPath);
  };

  const getSystemInfoCallback = async () => {
    const systemInfo = await getSystemInfo();
    // Convert bytes to GB and round to 2 decimal places
    systemInfo.totalMemory = Math.round((systemInfo.totalMemory / 1024 / 1024 / 1024) * 100) / 100;
    systemInfo.availableMemory =
      Math.round((systemInfo.availableMemory / 1024 / 1024 / 1024) * 100) / 100;
    logi('System Info', JSON.stringify(systemInfo, null, 2));
  };

  const testHuggingFace = async () => {
    const searchResults = await searchHuggingFaceModel('cjpais');
    const filesResults = await fetchHuggingFaceFiles(searchResults[0].name);

    // const model = await fetchHuggingFaceModel(searchResults[0].modelId);
    logi('Hugging face search', JSON.stringify(searchResults, null, 2));
    logi('Hugging face model', JSON.stringify(filesResults, null, 2));
  };

  return (
    <div className={classNames(s.sidebarFooter, [className])}>
      {import.meta.env.DEV && import.meta.env.VITE_PULSAR_SHOW_DEV_MENU === 'true' && (
        <>
          <Button className={s.btn} onClick={openAppData} variant="secondary">
            Open App Data
          </Button>
          <Button className={s.btn} onClick={getSystemInfoCallback} variant="secondary">
            Get System Info
          </Button>
          <Button className={s.btn} onClick={testHuggingFace} variant="secondary">
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
