import { useUnit } from 'effector-react';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';

import ListIcon from '@/shared/assets/icons/list.svg';
import { classNames } from '@/shared/lib/func';
import { Badge, Icon, ScrollArea, Select, Text } from '@/shared/ui';

import { AGENT_CATEGORIES_MAP } from '../../consts/categories.const.ts';
import { agentsLibModel } from '../../model/agents-lib.model.ts';
import { Agent } from '../../types/agent.types.ts';
import { AgentsSorting, AgentsSortingData } from '../../types/agents-sorting.types.ts';
import { AgentCard } from '../AgentCard/AgentCard.tsx';
import s from './AgentCardsList.module.scss';

interface Props {
  className?: string;
  agents: Agent[];
  loading: boolean;
  categories: Id[];
}

const optionsArr = [AgentsSorting.TRENDING, AgentsSorting.ALL, AgentsSorting.MY].map((i) => ({
  label: AgentsSortingData[i].label,
  value: AgentsSortingData[i].value,
}));

function getTitle(categories: Id[], isSearch: boolean) {
  if (isSearch) return 'Search Results';

  if (categories.length === 0) return 'All Categories';

  return categories.map((i) => AGENT_CATEGORIES_MAP[i].name).join(', ');
}

export const AgentCardsList = memo((props: Props) => {
  const { className, loading, agents, categories } = props;

  const isSearch = false;
  const sorting = useUnit(agentsLibModel.$sorting);

  const handleScroll = useCallback((e: any) => {
    agentsLibModel.setListScroll(e.target.scrollTop);
  }, []);

  return (
    <div className={classNames(s.agentCardsList, [className])}>
      <div className={s.header}>
        <div className={s.title}>
          <Icon svg={ListIcon} className={s.icon} />
          <Text w="bold" s={20} c="primary">
            {getTitle(categories, isSearch)}
          </Text>
          <Badge content={agents.length} className={s.badge} round c="quaternary" />
        </div>
        <Select
          type="secondary"
          options={optionsArr}
          value={sorting}
          onChange={(v) => agentsLibModel.setSorting(v as AgentsSorting)}
        />
      </div>

      <ScrollArea
        onScroll={handleScroll}
        height="calc(100vh - 448px)"
        className={s.list}
        initialScroll={agentsLibModel.$listScroll.getState()}
      >
        {loading ? (
          <Text className={s.searching}>Searching...</Text>
        ) : (
          agents.map((i) => <AgentCard agent={i} />)
        )}
      </ScrollArea>
    </div>
  );
});
