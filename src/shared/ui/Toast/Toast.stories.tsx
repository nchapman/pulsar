import type { Meta, StoryObj } from '@storybook/preact';
import { ToastContainer } from 'react-toastify';

import { Button, showToast } from '@/shared/ui';

const meta: Meta = {
  title: 'shared/Toast',
  component: Button,
  args: {
    variant: 'primary',
    children: 'Show toast',
  },
  decorators: (S: any) => (
    <div
      style={{
        width: 700,
        height: 400,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <S />
      </div>
      <ToastContainer />
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Success: Story = {
  args: {
    onClick: () =>
      showToast({
        type: 'success',
        title: 'Operation succeeded!',
        message: 'Lorem ipsum dolor',
      }),
  },
};

// export const Info: Story = {
//   args: {
//     onClick: () =>
//       showToast({
//         type: 'info',
//         title: 'Event happened.',
//         message: 'Lorem ipsum dolor',
//       }),
//   },
// };
//
// export const Error: Story = {
//   args: {
//     onClick: () =>
//       showToast({
//         type: 'error',
//         title: 'Error occurred!',
//         message: 'Lorem ipsum dolor',
//       }),
//   },
// };
