import { os } from '@tauri-apps/api';
import { FC, memo } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { createPortal } from 'react';

import { ToolbarLinux } from '@/widgets/toolbar/ui/ToolbarLinux/ToolbarLinux.tsx';
import { ToolbarMacOS } from '@/widgets/toolbar/ui/ToolbarMacOS/ToolbarMacOS.tsx';
import { ToolbarWindows } from '@/widgets/toolbar/ui/ToolbarWindows/ToolbarWindows.tsx';

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
  const [osType, setOsType] = useState<os.OsType>();

  useEffect(() => {
    os.type().then(setOsType);
  }, []);

  if (!osType) return null;

  const ToolbarComponent = toolbar[osType];

  return createPortal(<ToolbarComponent {...props} />, document.querySelector('#toolbar')!);
});
