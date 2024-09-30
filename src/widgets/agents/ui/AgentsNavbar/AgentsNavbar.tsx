import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { $currRoute, goToChat, goToStore, Route } from '@/app/routes';
import BackIcon from '@/shared/assets/icons/arrow-right.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';
import { modelStoreEvents } from '@/widgets/model-store';

import s from './AgentsNavbar.module.scss';

export const AgentsNavbar = memo(() => {
  const agent: Id | null = null;
  const route = useUnit($currRoute);

  const handleBack = () => {
    if (agent) {
      modelStoreEvents.closeModelDetails();
    } else if (route === Route.StoreSearch) {
      goToStore();
    } else {
      goToChat();
    }
  };

  return (
    <div className={classNames(s.agentsNavbar)}>
      {route === Route.StoreModel && (
        <Button variant="clear" icon={BackIcon} className={s.backButton} onClick={handleBack} />
      )}

      <Text s={14} w="medium" className={s.store} c="primary">
        Agents Library {agent ? ' / ' : ''}
      </Text>

      {agent && (
        <Text s={14} w="medium" c="primary">
          {agent}
        </Text>
      )}
    </div>
  );
});
