import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';

import { DownloadModel, DownloadsRepository } from '@/db/download';
import { __IS_STORYBOOK__ } from '@/shared/consts';

import { ChatModel, ChatsRepository, ChatsRepositoryMock } from './chat';
import { ModelModel, ModelsRepository, ModelsRepositoryMock } from './model';
import { ModelFileModel, ModelFilesRepository, ModelFilesRepositoryMock } from './model-file';
import { adapter } from './nativeAdapter';

const database = __IS_STORYBOOK__
  ? undefined
  : new Database({
      adapter,
      modelClasses: [ChatModel, ModelFileModel, DownloadModel, ModelModel] as Class<Model>[],
    });

// Repositories
export const chatsRepository = (
  __IS_STORYBOOK__ ? new ChatsRepositoryMock() : new ChatsRepository(database!)
) as ChatsRepository;

export const modelFilesRepository = (
  __IS_STORYBOOK__ ? new ModelFilesRepositoryMock() : new ModelFilesRepository(database!)
) as ModelFilesRepository;

export const modelsRepository = (
  __IS_STORYBOOK__ ? new ModelsRepositoryMock() : new ModelsRepository(database!)
) as ModelsRepository;

export const downloadsRepository = (
  __IS_STORYBOOK__ ? undefined : new DownloadsRepository(database!)
) as DownloadsRepository;
