import { Database, Model } from '@nozbe/watermelondb';
import { Class } from '@nozbe/watermelondb/types';

import { __IS_STORYBOOK__ } from '@/shared/consts';

import { ChatModel, ChatsRepository } from './chat';
import { ChatsRepositoryMock } from './chat/chat.repository.mock.ts';
import { adapter } from './nativeAdapter';

const database = __IS_STORYBOOK__
  ? undefined
  : new Database({
      adapter,
      modelClasses: [ChatModel] as Class<Model>[],
    });

// Repositories
export const chatsRepository = (
  __IS_STORYBOOK__ ? new ChatsRepositoryMock() : new ChatsRepository(database!)
) as ChatsRepository;
