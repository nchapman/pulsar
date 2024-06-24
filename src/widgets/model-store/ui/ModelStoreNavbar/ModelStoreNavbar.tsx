import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { goToChat } from '@/app/routes';
import BackIcon from '@/shared/assets/icons/arrow-right.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { $modelStoreState, modelStoreEvents } from '../../model/model-store.model.ts';
import s from './ModelStoreNavbar.module.scss';

export const ModelStoreNavbar = memo(() => {
  const model = useUnit($modelStoreState.currModel);
  const handleBack = () => {
    if (model) {
      modelStoreEvents.closeModelDetails();
    } else {
      goToChat();
    }
  };

  return (
    <div className={classNames(s.modelStoreNavbar, [], { [s.detailsMode]: !!model })}>
      <Button variant="clear" icon={BackIcon} className={s.backButton} onClick={handleBack} />

      <Text s={14} w="medium" className={s.store} c="primary">
        Store {model ? ' / ' : ''}
      </Text>

      {model && (
        <Text s={14} w="medium" c="primary">
          {model}
        </Text>
      )}
    </div>
  );
});
