import { useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import { cleanUpDB } from '@/app/lib/cleanUpDB.ts';
import { modelManager } from '@/entities/model';
import { initTheme } from '@/shared/theme';
import { PageError, PageLoader } from '@/shared/ui';
import { OnboardingPage } from '@/widgets/onboarding';

import { Layout } from './Layout/Layout.tsx';
import { checkUpdates } from './Updates';

function App() {
  const hasNoModels = useUnit(modelManager.state.$hasNoModels);
  const modelLoadError = useUnit(modelManager.state.$loadError);
  const appStarted = useUnit(modelManager.state.$appStarted);
  const ready = useUnit(modelManager.state.$ready);

  useEffect(() => {
    initTheme();
    checkUpdates();
    cleanUpDB();
  }, []);

  function getComponent() {
    if (!appStarted) return <PageLoader />;
    if (modelLoadError) return <PageError errorText={`Failed to load model: ${modelLoadError}.`} />;
    if (hasNoModels) return <OnboardingPage />;
    if (!ready && !hasNoModels) return <OnboardingPage ready />;
    if (ready) return <Layout />;

    return null;
  }

  return <div className="app">{getComponent()}</div>;
}

export default App;
