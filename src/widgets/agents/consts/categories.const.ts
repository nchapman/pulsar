export interface Category {
  name: string;
  id: string;
}

export const AGENT_CATEGORIES: Category[] = [
  { name: 'Writing', id: '1' },
  { name: 'Programming', id: '2' },
  { name: 'Consulting', id: '3' },
  { name: 'Lyrics', id: '4' },
  { name: 'Coding', id: '5' },
  { name: 'Assessment', id: '6' },
  { name: 'Python', id: '7' },
  { name: 'Frontend', id: '8' },
  { name: 'Research', id: '9' },
  { name: 'Creative', id: '10' },
  { name: 'Education', id: '11' },
  { name: 'Language', id: '12' },
  { name: 'Design', id: '13' },
  { name: 'Agulu', id: '14' },
  { name: 'Conversion', id: '15' },
  { name: 'Deployment', id: '16' },
  { name: 'Guidance', id: '17' },
  { name: 'User Experience', id: '18' },
  { name: 'Problem Solving', id: '19' },
  { name: 'SEO', id: '20' },
  { name: 'Software Development', id: '21' },
];

export const AGENT_CATEGORIES_MAP: Record<string, Category> = AGENT_CATEGORIES.reduce(
  (acc, category) => ({ ...acc, [category.id]: category }),
  {}
);
