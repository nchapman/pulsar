import { combine } from 'effector';

import { modelManager } from '../managers/model-manager';

export const $currModelData = combine(
  modelManager.state.$currentModel,
  modelManager.state.$modelFiles,
  (id, models) => (id && models ? models[id] : null),
  { skipVoid: false }
);
