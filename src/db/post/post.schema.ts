import { tableSchema } from '@nozbe/watermelondb';

export const postsTable = {
  name: 'post',
  cols: {
    title: 'title',
    body: 'body',
    isPinned: 'is_pinned',
  },
};

export const postSchema = tableSchema({
  name: postsTable.name,
  columns: [
    { name: postsTable.cols.title, type: 'string' },
    // { name: postsTable.cols.body, type: 'string' },
    { name: postsTable.cols.isPinned, type: 'boolean' },
  ],
});
