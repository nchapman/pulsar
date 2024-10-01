import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import { $currRoute, Route } from '@/app/routes';
import BackIcon from '@/shared/assets/icons/arrow-right.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Text } from '@/shared/ui';

import { agentsLibModel } from '../../model/agents-lib.model.ts';
import s from './AgentsNavbar.module.scss';

export const AgentsNavbar = memo(() => {
  const agent = useUnit(agentsLibModel.$currAgentData);
  const route = useUnit($currRoute);

  const handleBack = () => {
    if (agent) {
      agentsLibModel.closeAgentDetails();
    }
  };

  return (
    <div className={classNames(s.agentsNavbar, [], { [s.detailsMode]: !!agent })}>
      {route === Route.AgentsDetails && (
        <Button variant="clear" icon={BackIcon} className={s.backButton} onClick={handleBack} />
      )}

      <Text s={14} w="medium" className={s.lib} c="primary">
        Agents Library {agent ? ' / ' : ''}
      </Text>

      {agent && (
        <Text s={14} w="medium" c="primary">
          {agent.name}
        </Text>
      )}
    </div>
  );
});
