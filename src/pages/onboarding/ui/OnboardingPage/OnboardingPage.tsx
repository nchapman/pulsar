import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import { InitialModelDownload } from '@/entities/model';
import { classNames } from '@/shared/lib/func';
import { Toolbar } from '@/widgets/toolbar';

import { minimizeWindowSize } from '../../lib/window-size.ts';
import { OnboardingContent } from '../OnboardingContent/OnboardingContent.tsx';
import s from './OnboardingPage.module.scss';

interface Props {
  className?: string;
}

export const OnboardingPage = memo((props: Props) => {
  const { className } = props;

  useEffect(() => {
    minimizeWindowSize();
  }, []);

  return (
    <div className={classNames(s.onboardingPage, [className])}>
      <Toolbar />
      <OnboardingContent />
      <InitialModelDownload />
    </div>
  );
});
