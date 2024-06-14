import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';

import { InitialModelDownload } from '@/entities/model';
import { OnboardingReady } from '@/pages/onboarding/ui/OnboardingReady/OnboardingReady.tsx';
import { classNames } from '@/shared/lib/func';
import { Toolbar } from '@/widgets/toolbar';

import { minimizeWindowSize } from '../../lib/window-size.ts';
import { OnboardingContent } from '../OnboardingContent/OnboardingContent.tsx';
import s from './OnboardingPage.module.scss';

interface Props {
  className?: string;
  ready?: boolean;
}

export const OnboardingPage = memo((props: Props) => {
  const { className, ready } = props;

  useEffect(() => {
    minimizeWindowSize();
  }, [ready]);

  const downloadContent = (
    <>
      <OnboardingContent />
      <InitialModelDownload />
    </>
  );

  return (
    <div className={classNames(s.onboardingPage, [className])}>
      <Toolbar />
      {ready ? <OnboardingReady /> : downloadContent}
    </div>
  );
});
