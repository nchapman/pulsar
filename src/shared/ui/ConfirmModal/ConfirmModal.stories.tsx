import type { Meta, StoryObj } from '@storybook/preact';

import { Button } from '@/shared/ui';

import { confirm, ConfirmModal } from './ConfirmModal.tsx';

const meta: Meta<typeof ConfirmModal> = {
  title: 'shared/ConfirmModal',
  component: ConfirmModal,
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Danger: Story = {
  decorators: (Story: any) => (
    <>
      <Button
        variant="primary"
        onClick={() =>
          confirm({
            type: 'danger',
            confirmText: 'Delete',
            title: 'Are you sure?',
            message: 'This action cannot be undone.',
            onConfirm: () => undefined,
          })
        }
      >
        Open modal
      </Button>
      <Story />
    </>
  ),
};

export const Info: Story = {
  decorators: (Story: any) => (
    <>
      <Button
        variant="primary"
        onClick={() =>
          confirm({
            type: 'info',
            confirmText: 'Confirm',
            title: 'Are you sure?',
            message: 'This action cannot be undone.',
            onConfirm: () => undefined,
          })
        }
      >
        Open modal
      </Button>
      <Story />
    </>
  ),
};
