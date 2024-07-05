import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { codeTheme } from '@/entities/markdown/consts/codeTheme.ts';
import CheckIcon from '@/shared/assets/icons/check.svg';
import CopyIcon from '@/shared/assets/icons/copy.svg';
import { classNames } from '@/shared/lib/func';
import { useCopy } from '@/shared/lib/hooks';
import { Button, Icon, Text, Tooltip } from '@/shared/ui';

import s from './Code.module.scss';

interface Props {
  className?: string;
  children: string;
  node?: any;
}

export const Code = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, className, node, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');

  const lang = match?.[1] || '';

  const { copy, copied, resetCopy } = useCopy();

  useEffect(() => {
    if (!copied) return undefined;

    const id = setTimeout(resetCopy, 2000);

    return () => clearTimeout(id);
  }, [copied, resetCopy]);

  if (!lang && children === 'cursor') return <span className={s.cursor} />;

  return (
    <div className={classNames(s.code, [className])}>
      <div className={s.header}>
        <Text s={12} w="medium" c="primary">
          {lang}
        </Text>

        <Tooltip text="Copy">
          <Button onClick={() => copy(children)} variant="clear" className={s.copyBtn}>
            <Text s={12} w="medium">
              {copied ? 'Copied!' : 'Copy code'}
            </Text>
            <Icon size={16} svg={copied ? CheckIcon : CopyIcon} />
          </Button>
        </Tooltip>
      </div>

      <div className={s.body}>
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          language={match?.[1] || 'plaintext'}
          style={codeTheme}
          customStyle={{ margin: 0 }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});
