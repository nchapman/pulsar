import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';

import { AgentsRepositoryMock } from '@/db/agent/agent.repository.mock.ts';
import { DownloadsRepositoryMock } from '@/db/download/download.repository.mock.ts';
import { __IS_STORYBOOK__ } from '@/shared/consts';

import { AgentModel, AgentsRepository } from './agent';
import { ChatModel, ChatsRepository, ChatsRepositoryMock } from './chat';
import { DownloadModel, DownloadsRepository } from './download';
import { ModelModel, ModelsRepository, ModelsRepositoryMock } from './model';
import { ModelFileModel, ModelFilesRepository, ModelFilesRepositoryMock } from './model-file';
import { adapter } from './nativeAdapter';

function withStoryBook<T>(v: () => T, sbV?: () => any): T {
  return !__IS_STORYBOOK__ ? v() : (sbV?.() as T);
}

const database = withStoryBook(
  () =>
    new Database({
      adapter,
      modelClasses: [
        ChatModel,
        ModelFileModel,
        DownloadModel,
        ModelModel,
        AgentModel,
      ] as Class<Model>[],
    })
);

// Repositories
export const chatsRepository = withStoryBook(
  () => new ChatsRepository(database),
  () => new ChatsRepositoryMock()
);

export const modelFilesRepository = withStoryBook(
  () => new ModelFilesRepository(database),
  () => new ModelFilesRepositoryMock()
);

export const modelsRepository = withStoryBook(
  () => new ModelsRepository(database),
  () => new ModelsRepositoryMock()
);

export const downloadsRepository = withStoryBook(
  () => new DownloadsRepository(database),
  () => new DownloadsRepositoryMock()
);

export const agentsRepository = withStoryBook(
  () => new AgentsRepository(database),
  () => new AgentsRepositoryMock()
);
