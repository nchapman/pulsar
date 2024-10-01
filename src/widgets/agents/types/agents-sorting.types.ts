export enum AgentsSorting {
  TRENDING = 'trending',
  ALL = 'all',
  MY = 'my',
}

export const AgentsSortingData: Record<
  AgentsSorting,
  { label: string; value: string; sort: any; direction?: 1 | -1 }
> = {
  [AgentsSorting.TRENDING]: {
    label: 'Trending',
    value: AgentsSorting.TRENDING,
    sort: 'createdAt',
    direction: -1,
  },
  [AgentsSorting.ALL]: {
    label: 'All Agents',
    value: AgentsSorting.ALL,
    sort: 'createdAt',
    direction: 1,
  },
  [AgentsSorting.MY]: {
    label: 'My Agents',
    value: AgentsSorting.MY,
    sort: 'downloads',
    direction: -1,
  },
};
