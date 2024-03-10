/* eslint-disable react/prop-types */
import { FC, ReactNode, useLayoutEffect } from 'preact/compat';
import { useRef, useState } from 'preact/hooks';

import ExpandIcon from '@/shared/assets/icons/expand.svg';
import { classNames } from '@/shared/lib/func';
import { Icon } from '@/shared/ui';

import s from './Collapsible.module.scss';

interface CollapsibleProps {
  head: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  withIcon?: boolean;
  wholeClickable?: boolean;
  headClassName?: string;
  expandedHeadClassName?: string;
  collapsed?: boolean;
  setCollapsed?: (expanded: boolean) => void;
  updateHeightFlag?: any;
}

export const Collapsible: FC<CollapsibleProps> = ({
  head,
  children,
  defaultExpanded,
  withIcon = true,
  wholeClickable,
  headClassName,
  expandedHeadClassName,
  collapsed,
  setCollapsed,
  updateHeightFlag,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const finalCollapsed = collapsed === undefined ? isCollapsed : collapsed;
  const finalSetCollapsed = setCollapsed || setIsCollapsed;

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [updateHeightFlag]);

  const toggleCollapse = () => {
    finalSetCollapsed(!finalCollapsed);
  };

  return (
    <div
      onClick={wholeClickable ? toggleCollapse : undefined}
      className={classNames(s.collapsible, [], {
        [s.expanded]: !finalCollapsed,
        [s.wholeClickable]: wholeClickable,
      })}
    >
      <div
        className={classNames(s.head, [headClassName], {
          [expandedHeadClassName || '']: !finalCollapsed && expandedHeadClassName,
        })}
        onClick={!wholeClickable ? toggleCollapse : undefined}
      >
        {typeof head === 'string' ? <h2>{head}</h2> : head}
        {/* @ts-ignore */}
        {withIcon && <Icon className={s.icon} Svg={ExpandIcon} />}
      </div>
      <div
        className={s.content}
        style={{ maxHeight: finalCollapsed ? 0 : contentHeight }}
        ref={contentRef}
      >
        <div className={s.contentWrapper}>{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
