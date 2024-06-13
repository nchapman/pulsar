import { useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import { modelManager } from '@/entities/model';
import { ChatPage } from '@/pages/chat';
import { OnboardingPage } from '@/pages/onboarding';
import { initTheme } from '@/shared/theme';

import { checkUpdates } from './Updates';

function App() {
  const hasNoModels = useUnit(modelManager.state.$hasNoModels);
  const modelLoadError = useUnit(modelManager.state.$loadError);

  useEffect(() => {
    initTheme();
    checkUpdates();
  }, []);

  function getComponent() {
    if (modelLoadError) return <div>Failed to load model: {modelLoadError}! Contact support</div>;
    if (hasNoModels) return <OnboardingPage />;
    return <ChatPage />;
  }

  return <div className="app">{getComponent()}</div>;
}

export default App;
