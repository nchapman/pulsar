import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { $currRoute, goToChat, goToStore, Route } from '@/app/routes';
import BackIcon from '@/shared/assets/icons/arrow-right.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { $modelStoreState, modelStoreEvents } from '../../model/model-store.model.ts';
import s from './ModelStoreNavbar.module.scss';

export const ModelStoreNavbar = memo(() => {
  const model = useUnit($modelStoreState.currModel);
  const route = useUnit($currRoute);

  const handleBack = () => {
    if (model) {
      modelStoreEvents.closeModelDetails();
    } else if (route === Route.StoreSearch) {
      goToStore();
    } else {
      goToChat();
    }
  };

  return (
    <div className={classNames(s.modelStoreNavbar, [], { [s.detailsMode]: !!model })}>
      {route === Route.StoreModel && (
        <Button variant="clear" icon={BackIcon} className={s.backButton} onClick={handleBack} />
      )}

      <Text s={14} w="medium" className={s.store} c="primary">
        Model Store {model ? ' / ' : ''}
      </Text>

      {model && (
        <Text s={14} w="medium" c="primary">
          {model}
        </Text>
      )}
    </div>
  );
});
