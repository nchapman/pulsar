import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import ArrowLeftIcon from '@/shared/assets/icons/chevron-down.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';
import { agentsMock } from '@/widgets/agents/mocks/agents.mock.ts';
import { agentsNavbarModel } from '@/widgets/agents/model/agents-navbar.model.ts';

import s from './AgentDetailsNavbar.module.scss';

interface Props {
  className?: string;
}

const imgSrc = 'https://via.assets.so/album.png?id=7&q=95&w=360&h=360&fit=fill';

export const AgentDetailsNavbar = memo((props: Props) => {
  const { className } = props;
  const agentId = useUnit(agentsNavbarModel.$detailsAgent);

  if (!agentId) return null;

  const agent = agentsMock.find((agent) => agent.id === agentId)!;

  const handleBack = (e: any) => {
    agentsNavbarModel.setDetailsAgent(null);
    e.stopPropagation();
  };

  return (
    <div className={classNames(s.agentDetailsNavbar, [className])}>
      <div className={s.header} onClick={handleBack}>
        <Icon svg={ArrowLeftIcon} />
        <Text s={16} w="semi" c="primary">
          My agents
        </Text>
      </div>

      <div className={s.thumbnail}>
        <img src={imgSrc} />
      </div>

      <div className={s.info}>
        <div className={s.mainInfo}>
          <img className={s.icon} src={agent.icon} />
          <Text s={16} c="primary" w="semi" className={s.name}>
            {agent.name}
          </Text>
        </div>
        <Text s={12} className={s.name}>
          Published by {agent.author}
        </Text>
      </div>
      <Text c="primary" s={14}>
        {agent.description}
      </Text>
    </div>
  );
});
