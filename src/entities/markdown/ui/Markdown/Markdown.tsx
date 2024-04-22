import { memo } from 'preact/compat';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Code } from '@/entities/markdown/ui/Code/Code.tsx';
import { classNames } from '@/shared/lib/func';

import s from './Markdown.module.scss';

interface Props {
  className?: string;
  text: string;
}

const components: Partial<Components> = { code: Code };

export const Markdown = memo((props: Props) => {
  const { className, text } = props;

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      className={classNames(s.markdown, [className])}
    >
      {text}
    </ReactMarkdown>
  );
});
