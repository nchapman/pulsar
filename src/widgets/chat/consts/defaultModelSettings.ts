import { ModelSettings } from '@/db/chat/chat.repository.ts';

export const defaultModelSettings: ModelSettings = {
  topP: 0.9,
  temp: 0.8,
  maxLength: 10000,
  stopTokens: [],
};
