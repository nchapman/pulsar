import { memo } from 'preact/compat';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Code } from '@/entities/markdown/ui/Code/Code.tsx';
import { classNames } from '@/shared/lib/func';

import s from './Markdown.module.scss';

interface Props {
  className?: string;
  text: string;
  isGenerating: boolean;
}

const components: Partial<Components> = {
  code: Code,
  progress: () => <span className={s.cursor} />,
  // table: ({ children }) => (
  //   <div className={s.table}>
  //     <table>{children}</table>
  //   </div>
  // ),
};

// const caret = ' ```cursor```';

export const Markdown = memo((props: Props) => {
  const { className, text, isGenerating } = props;

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      className={classNames(s.markdown, [className])}
    >
      {`${text}${isGenerating || !text ? '|' : ''}`}
    </ReactMarkdown>
  );
});
