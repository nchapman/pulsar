import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';

import { ModelsRepositoryMock } from '@/db/model/model.repository.mock.ts';
import { __IS_STORYBOOK__ } from '@/shared/consts';

import { ChatModel, ChatsRepository, ChatsRepositoryMock } from './chat';
import { ModelModel, ModelsRepository } from './model';
import { adapter } from './nativeAdapter';

const database = __IS_STORYBOOK__
  ? undefined
  : new Database({
      adapter,
      modelClasses: [ChatModel, ModelModel] as Class<Model>[],
    });

// Repositories
export const chatsRepository = (
  __IS_STORYBOOK__ ? new ChatsRepositoryMock() : new ChatsRepository(database!)
) as ChatsRepository;

export const modelsRepository = (
  __IS_STORYBOOK__ ? new ModelsRepositoryMock() : new ModelsRepository(database!)
) as ModelsRepository;
