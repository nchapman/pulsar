import { fs } from '@tauri-apps/api';
import { appDataDir } from '@tauri-apps/api/path';
import { open as openPath } from '@tauri-apps/api/shell';
import { memo } from 'preact/compat';

import { downloadModel } from '@/entities/model';
import { Nebula } from '@/entities/model/nebula/Nebula.ts';
import { getSystemInfo } from '@/features/system/system.ts';
import { __IS_STORYBOOK__ } from '@/shared/consts';
import { getFileSha256, getFileSizeBytes } from '@/shared/lib/file-system.ts';
import { download, getRandomInt, interruptFileTransfer } from '@/shared/lib/file-transfer.ts';
import { classNames } from '@/shared/lib/func';
import { loge, logi } from '@/shared/lib/Logger.ts';
import { Button } from '@/shared/ui';
import { getCuratedModels } from '@/widgets/model-store/api/curated-hugging-face-models.ts';
import {
  fetchHuggingFaceFiles,
  searchHuggingFaceModels,
} from '@/widgets/model-store/api/search-hugging-face.ts';

import s from './TestFeatures.module.scss';

interface Props {
  className?: string;
}
export const TestFeatures = memo((props: Props) => {
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
    const searchResults = await searchHuggingFaceModels({ query: 'cjpais' });

    const filesResults = await fetchHuggingFaceFiles(searchResults[0].name);

    const generalFeaturedModels = await getCuratedModels('general');

    // const model-file = await fetchHuggingFaceModel(searchResults[0].modelId);
    logi('Hugging face search', JSON.stringify(searchResults, null, 2));
    logi('Hugging face model-file', JSON.stringify(filesResults, null, 2));
    logi('Curated models', JSON.stringify(generalFeaturedModels, null, 2));
  };

  const getNebulaLoadedModels = async () => {
    const loadedModels = await Nebula.getLoadedModels();
    logi('Nebula loaded models', loadedModels);
  };

  const testResumeDownload = async () => {
    try {
      downloadModel({
        url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
        fileName: 'llava-v1.6-mistral-7b.Q4_K_M.gguf',
        onProgress: (p) => logi('downloadModel', `Progress: ${p}`),
        model: 'cjpais/llava-1.6-mistral-7b-gguf',
      });
      downloadModel({
        url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/mmproj-model-f16.gguf?download=true',
        model: 'cjpais/llava-1.6-mistral-7b-gguf',
        fileName: 'mmproj-model-file-f16.gguf',
        onProgress: (p) => logi('downloadModel', `Progress: ${p}`),
      });
    } catch (e) {
      loge('downloadModel', `Failed to download ${e}`);
    }
  };

  const testGetFileSize = async () => {
    const appDataDirPath = await appDataDir();
    // eslint-disable-next-line max-len
    const modelPath = `${appDataDirPath}models/llava-v1.6-mistral-7b.Q4_K_M.gguf`;
    try {
      const size = await getFileSizeBytes(modelPath);
      logi('fileSize', `File size ${size}`);
    } catch (e) {
      loge('fileSize', `Failed to get file size ${e}`);
    }
  };

  const testGetFileSHA256 = async () => {
    const appDataDirPath = await appDataDir();
    // eslint-disable-next-line max-len
    const modelPath = `${appDataDirPath}models/llava-v1.6-mistral-7b.Q4_K_M.gguf`;
    try {
      logi('fileSHA256', 'Starting SHA calculation...');
      const sha256 = await getFileSha256(modelPath);
      logi('fileSHA256', `File SHA256 ${sha256}`);
    } catch (e) {
      loge('fileSHA256', `Failed to get file SHA256 ${e}`);
    }
  };

  const testInterruptDownload = async () => {
    // delete any existing file
    const appDataDirPath = await appDataDir();
    // eslint-disable-next-line max-len
    const modelPath = `${appDataDirPath}/test-interrupt-download.gguf`;
    try {
      fs.removeFile(modelPath);
    } catch (e) {
      // ignore
    }

    logi('download', 'Starting download');
    try {
      const id = getRandomInt();
      setTimeout(() => {
        interruptFileTransfer(id);
      }, 1000);
      await download({
        id,
        url: 'https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf?download=true',
        path: modelPath,
        progressHandler: (_id, progress, total) => {
          logi(
            'download',
            `Progress: ${Math.round(progress / total)} %. bytes ${progress} of ${total}`
          );
        },
      });
    } catch (e) {
      loge('download', `Failed to download ${e}`);
    }
  };

  return (
    <div className={classNames(s.testFeatures, [className])}>
      {import.meta.env.DEV &&
        import.meta.env.VITE_HIRO_SHOW_DEV_MENU === 'true' &&
        !__IS_STORYBOOK__ && (
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
            <Button className={s.btn} onClick={testGetFileSize} variant="secondary">
              Get file size test
            </Button>
            <Button className={s.btn} onClick={testGetFileSHA256} variant="secondary">
              Get file sha 256 test
            </Button>
            <Button className={s.btn} onClick={testInterruptDownload} variant="secondary">
              Test interrupt download
            </Button>
            <Button className={s.btn} onClick={testResumeDownload} variant="secondary">
              Resume download
            </Button>
          </>
        )}
    </div>
  );
});
