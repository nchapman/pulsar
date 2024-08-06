import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { ModelLoadingIndicator, modelManager, SwitchModelInsideChat } from '@/entities/model';
import { classNames } from '@/shared/lib/func';

import s from './ChatNavbar.module.scss';

const $showLoadingIndicator = modelManager.state.$loadingProgress.map(
  (loadingProgress) => loadingProgress > 0 && loadingProgress < 1
);

export const ChatNavbar = memo(() => {
  const showLoadingIndicator = useUnit($showLoadingIndicator);

  return (
    <div className={classNames(s.chatNavbar)}>
      {showLoadingIndicator ? <ModelLoadingIndicator /> : <SwitchModelInsideChat />}
    </div>
  );
});
