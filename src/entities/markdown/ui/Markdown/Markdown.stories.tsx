import type { Meta, StoryObj } from '@storybook/preact';

import { codeMarkdownMock } from '@/entities/markdown/mocks/code-markdown.mock.ts';
import { headingsMarkdownMock } from '@/entities/markdown/mocks/headings-markdown.mock.ts';
import { linksMarkdownMock } from '@/entities/markdown/mocks/links-markdown.mock.ts';
import { olMarkdownMock } from '@/entities/markdown/mocks/ol-markdown.mock.ts';
import { tableMarkdownMock } from '@/entities/markdown/mocks/table-markdown.mock.ts';
import { ulMarkdownMock } from '@/entities/markdown/mocks/ul-markdown.mock.ts';

import { Markdown } from './Markdown';

const meta: Meta<typeof Markdown> = {
  title: 'entities/Markdown',
  component: Markdown,
  args: {
    isGenerating: false,
  },
  decorators: (story) => <div style={{ width: 692 }}>{story()}</div>,
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof Markdown>;
export const Table: Story = {
  args: { text: tableMarkdownMock },
};

export const OrderedList: Story = {
  args: { text: olMarkdownMock },
};

export const BulletedList: Story = {
  args: { text: ulMarkdownMock },
};

export const Headings: Story = {
  args: { text: headingsMarkdownMock },
};

export const Links: Story = {
  args: { text: linksMarkdownMock },
};

export const Code: Story = {
  args: { text: codeMarkdownMock },
};
