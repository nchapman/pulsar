import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';

import LikeIcon from '@/shared/assets/icons/heart.svg';
import UsersIcon from '@/shared/assets/icons/users.svg';
import { classNames } from '@/shared/lib/func';
import { Button, Icon, Text } from '@/shared/ui';

import CheckIcon from '../../assets/check.svg';
import { AGENT_CATEGORIES_MAP } from '../../consts/categories.const.ts';
import { agentsLibModel } from '../../model/agents-lib.model.ts';
import { AgentPlayground } from '../AgentPlayground/AgentPlayground.tsx';
import s from './AgentDetailsPage.module.scss';

export const AgentDetailsPage = memo(() => {
  const agent = useUnit(agentsLibModel.$currAgentData);

  if (!agent) return null;

  const stats = [
    { icon: UsersIcon, value: agent.users },
    { icon: LikeIcon, value: agent.likes },
  ];

  return (
    <div className={classNames(s.agentDetailsPage)}>
      <div className={s.left}>
        <div className={s.details}>
          <img className={s.icon} src={agent.icon} />

          <div className={s.info}>
            <div>
              <Text s={20} c="primary" w="semi">
                {agent.name}
              </Text>

              <Text s={12} c="secondary">
                Created by {agent.author}
              </Text>
            </div>

            <div className={s.categories}>
              {agent.categories.map((i) => (
                <div className={s.category}>{AGENT_CATEGORIES_MAP[i].name}</div>
              ))}
            </div>

            <Text s={14}>{agent.description}</Text>
          </div>
          <div className={s.features}>
            {agent.features.map((i) => (
              <div className={s.feat}>
                <div className={s.check}>
                  <Icon size={14} svg={CheckIcon} className={s.checkIcon} />
                </div>
                <Text s={12} c="primary">
                  {i}
                </Text>
              </div>
            ))}
          </div>

          <div className={s.stats}>
            {stats.map((i, idx) => (
              <>
                <div className={s.stat}>
                  <Icon size={16} svg={i.icon} className={s.icon} />
                  <Text s={12} c="tertiary">
                    {i.value}
                  </Text>
                </div>
                {idx !== stats.length - 1 && <div className={s.statsDivider} />}
              </>
            ))}
          </div>
        </div>

        <div className={s.sectionDivider} />

        <Button variant="primary" className={s.addBtn}>
          Add Agent
        </Button>
      </div>

      <AgentPlayground className={s.playground} />
    </div>
  );
});
