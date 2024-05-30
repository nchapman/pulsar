import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';

import { downloadModel } from '@/entities/model';
import { Nebula } from '@/entities/model/nebula/Nebula';
import { getCuratedModels } from '@/features/hugging-face-search/CuratedHuggingFaceModels';
import {
  fetchHuggingFaceFiles,
  searchHuggingFaceModel,
} from '@/features/hugging-face-search/HuggingFaceSearch';
import { getSystemInfo } from '@/features/system/system';
import { classNames } from '@/shared/lib/func';
import { loge, logi } from '@/shared/lib/Logger';
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
    const generalFeaturedModels = await getCuratedModels('general');

    // const model = await fetchHuggingFaceModel(searchResults[0].modelId);
    logi('Hugging face search', JSON.stringify(searchResults, null, 2));
    logi('Hugging face model', JSON.stringify(filesResults, null, 2));
    logi('Curated models', JSON.stringify(generalFeaturedModels, null, 2));
  };

  const getNebulaLoadedModels = async () => {
    const loadedModels = await Nebula.getLoadedModels();
    logi('Nebula loaded models', loadedModels);
  };

  const testResumeDownload = async () => {
    try {
      downloadModel(
        'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
        'llava-v1.6-mistral-7b.Q4_K_M.gguf',
        (p) => logi('downloadModel', `Progress: ${p}`)
      );
      downloadModel(
        'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/mmproj-model-f16.gguf?download=true',
        'mmproj-model-f16.gguf',
        (p) => logi('downloadModel', `Progress: ${p}`)
      );
    } catch (e) {
      loge('downloadModel', `Failed to download ${e}`);
    }
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
          <Button className={s.btn} onClick={getNebulaLoadedModels} variant="secondary">
            Get nebula loaded models
          </Button>
          <Button className={s.btn} onClick={testHuggingFace} variant="secondary">
            Hugging face test
          </Button>
          <Button className={s.btn} onClick={testResumeDownload} variant="secondary">
            Resume download
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
