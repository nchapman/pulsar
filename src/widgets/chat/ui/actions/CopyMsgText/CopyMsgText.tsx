import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import CheckIcon from '@/shared/assets/icons/check.svg';
import CopyIcon from '@/shared/assets/icons/copy.svg';
import { classNames } from '@/shared/lib/func';
import { useCopy } from '@/shared/lib/hooks';
import { Button, Tooltip } from '@/shared/ui';

import s from './CopyMsgText.module.scss';

interface Props {
  className?: string;
  text: string;
}

export const CopyMsgText = memo((props: Props) => {
  const { className, text } = props;

  const { copy, copied, resetCopy } = useCopy();

  useEffect(() => {
    if (!copied) return undefined;

    const id = setTimeout(resetCopy, 3000);

    return () => clearTimeout(id);
  }, [copied, resetCopy]);

  return (
    <Tooltip text="Copy" position="bottom" show={!copied}>
      <Button
        iconSize={16}
        className={classNames(s.copyMsgText, [className])}
        onClick={() => copy(text)}
        variant="clear"
        icon={copied ? CheckIcon : CopyIcon}
      />
    </Tooltip>
  );
});
