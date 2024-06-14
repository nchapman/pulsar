import { useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import { modelManager } from '@/entities/model';
import { ChatPage } from '@/pages/chat';
import { OnboardingPage } from '@/pages/onboarding';
import { restoreWindowSize } from '@/pages/onboarding/lib/window-size.ts';
import { initTheme } from '@/shared/theme';

import { checkUpdates } from './Updates';

function App() {
  const hasNoModels = useUnit(modelManager.state.$hasNoModels);
  const modelLoadError = useUnit(modelManager.state.$loadError);
  const appStarted = useUnit(modelManager.state.$appStarted);
  const ready = useUnit(modelManager.state.$ready);

  useEffect(() => {
    initTheme();
    checkUpdates();
  }, []);

  useEffect(() => {
    if (ready) {
      restoreWindowSize();
    }
  }, [ready]);

  function getComponent() {
    if (!appStarted) return <div>Loading...</div>;
    if (modelLoadError) return <div>Failed to load model: {modelLoadError}! Contact support</div>;
    if (hasNoModels) return <OnboardingPage />;
    if (ready) return <ChatPage />;
    if (!ready && !hasNoModels) return <OnboardingPage ready />;

    return null;
  }

  return <div className="app">{getComponent()}</div>;
}

export default App;
