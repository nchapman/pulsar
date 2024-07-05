import type { Meta, StoryObj } from '@storybook/preact';

import { Button } from '@/shared/ui';
import { openSettingsModal } from '@/widgets/settings';

import { SettingsModal } from './SettingsModal';

const meta: Meta<typeof SettingsModal> = {
  title: 'widgets/SettingsModal/SettingsModal',
  component: SettingsModal,
  decorators: (story) => (
    <div id="#portal-root">
      {story()}
      <Button variant="primary" onClick={() => openSettingsModal()}>
        Open Modal
      </Button>
    </div>
  ),
} satisfies Meta<typeof SettingsModal>;

export default meta;
type Story = StoryObj<typeof SettingsModal>;
export const Primary: Story = {};
