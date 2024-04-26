import { createEffect, createEvent, createStore } from 'effector';

import { DEFAULT_LLM, DEFAULT_MMM } from '../consts/model.const.ts';
import { NebulaModel } from '../nebula/NebulaModel.ts';
import { LlmName } from '../types/model.types.ts';

// llm
export const $llmsAvailable = createStore<OptionalRecord<LlmName, boolean>>({});
export const $currentLlmName = createStore(DEFAULT_LLM);

export const $llm = createStore<NebulaModel | null>(null);

// mmm
export const $mmmsAvailable = createStore<OptionalRecord<LlmName, boolean>>({});
export const $currentMmmName = createStore(DEFAULT_MMM);

export const updateLlmsAvailable = createEvent<{ llm: LlmName; isAvailable: boolean }>();

$llmsAvailable.on(updateLlmsAvailable, (state, { llm, isAvailable }) => ({
  ...state,
  [llm]: isAvailable,
}));

export const updateMmmsAvailable = createEvent<{ mmm: LlmName; isAvailable: boolean }>();

$mmmsAvailable.on(updateMmmsAvailable, (state, { mmm, isAvailable }) => ({
  ...state,
  [mmm]: isAvailable,
}));

export const checkAvailableModels = createEffect(async () => {});
