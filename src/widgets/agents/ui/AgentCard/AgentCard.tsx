import { memo } from 'preact/compat';

import LikeIcon from '@/shared/assets/icons/heart.svg';
import UsersIcon from '@/shared/assets/icons/users.svg';
import { classNames } from '@/shared/lib/func';
import { Icon, Text } from '@/shared/ui';

import { AGENT_CATEGORIES_MAP } from '../../consts/categories.const.ts';
import { agentsLibModel } from '../../model/agents-lib.model.ts';
import { StoreAgent } from '../../types/agent.types.ts';
import s from './AgentCard.module.scss';

interface Props {
  className?: string;
  agent: StoreAgent;
}

function sliceCategories(categories: Id[]) {
  if (categories.length > 4) {
    return categories.slice(0, 4);
  }

  return categories;
}

export const AgentCard = memo((props: Props) => {
  const { className, agent } = props;

  const stats = [
    { icon: UsersIcon, value: agent.users },
    { icon: LikeIcon, value: agent.likes },
  ];

  const handeClick = () => {
    agentsLibModel.setCurrAgent(agent.id);
  };

  return (
    <div className={classNames(s.agentCard, [className])} onClick={handeClick}>
      <div className={s.header}>
        <img className={s.icon} src={agent.icon} />
        <div>
          <Text s={18} c="primary" w="bold">
            {agent.name}
          </Text>
          <Text s={12} c="tertiary" w="medium">
            Published by {agent.author}
          </Text>
        </div>
      </div>

      <Text s={14}>{agent.description}</Text>

      <div className={s.categories}>
        {sliceCategories(agent.categories).map((i) => (
          <div className={s.category}>{AGENT_CATEGORIES_MAP[i].name}</div>
        ))}
      </div>

      <div className={s.stats}>
        {stats.map((i, idx) => (
          <>
            <div className={s.stat}>
              <Icon size={16} svg={i.icon} className={s.icon} />
              <Text s={12} c="secondary">
                {i.value}
              </Text>
            </div>
            {idx !== stats.length - 1 && <div className={s.statsDivider} />}
          </>
        ))}
      </div>
    </div>
  );
});
