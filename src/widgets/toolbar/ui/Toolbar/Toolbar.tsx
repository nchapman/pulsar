import { os } from '@tauri-apps/api';
import { useUnit } from 'effector-react';
import { FC, memo } from 'preact/compat';
import { createPortal } from 'react';

import { $osType } from '@/app/model/os.model.ts';

import { ToolbarLinux } from '../ToolbarLinux/ToolbarLinux.tsx';
import { ToolbarMacOS } from '../ToolbarMacOS/ToolbarMacOS.tsx';
import { ToolbarWindows } from '../ToolbarWindows/ToolbarWindows.tsx';

interface Props {
  className?: string;
  onToggleSidebar?: () => void;
}

const toolbar: Record<os.OsType, FC<Props>> = {
  Darwin: ToolbarMacOS,
  Linux: ToolbarLinux,
  Windows_NT: ToolbarWindows,
};

export const Toolbar = memo((props: Props) => {
  const osType = useUnit($osType);

  if (!osType) return null;

  const ToolbarComponent = toolbar[osType];

  return createPortal(<ToolbarComponent {...props} />, document.querySelector('#toolbar')!);
});
