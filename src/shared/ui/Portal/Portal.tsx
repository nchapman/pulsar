import { VNode } from 'preact';
import { createPortal, ReactNode } from 'preact/compat';

interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export const Portal = (props: PortalProps) => {
  const { children, container = document.querySelector('#portal-root') } = props;

  return createPortal(children as VNode, container!);
};
