import { createPortal, ReactNode } from 'preact/compat';
import { VNode } from 'preact';

interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export const Portal = (props: PortalProps) => {
  const { children, container = document.querySelector('#portal-root') } = props;

  return createPortal(children as VNode, container!);
};
