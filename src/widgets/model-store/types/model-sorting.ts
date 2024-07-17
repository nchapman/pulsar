export enum ModelSorting {
  MOST_RECENT = 'most-recent',
  LEAST_RECENT = 'least-recent',
  MOST_DOWNLOADS = 'most-downloads',
  MOST_LIKES = 'most-likes',
}

export const ModelSortingData: Record<
  ModelSorting,
  { label: string; value: string; sort: any; direction?: 1 | -1 }
> = {
  [ModelSorting.MOST_RECENT]: {
    label: 'Most Recent',
    value: ModelSorting.MOST_RECENT,
    sort: 'createdAt',
    direction: -1,
  },
  [ModelSorting.LEAST_RECENT]: {
    label: 'Least Recent',
    value: ModelSorting.LEAST_RECENT,
    sort: 'createdAt',
    direction: 1,
  },
  [ModelSorting.MOST_DOWNLOADS]: {
    label: 'Most Downloads',
    value: ModelSorting.MOST_DOWNLOADS,
    sort: 'downloads',
    direction: -1,
  },
  [ModelSorting.MOST_LIKES]: {
    label: 'Most Likes',
    value: ModelSorting.MOST_LIKES,
    sort: 'likes',
    direction: -1,
  },
};
