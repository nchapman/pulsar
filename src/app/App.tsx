import { useUnit } from 'effector-react';
import { useEffect } from 'preact/hooks';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import {
  $missingModel,
  $modelLoadError,
  getAvailableModelsEff,
} from '@/entities/model/model/manage-models-model.ts';
import { ChatPage } from '@/pages/chat';
import { OnboardingPage } from '@/pages/onboarding';
import { initTheme } from '@/shared/theme';

import { checkUpdates } from './Updates';

function App() {
  const missingModel = useUnit($missingModel);

  useEffect(() => {
    initTheme();
    initAppFolders().then(() => getAvailableModelsEff());
    checkUpdates();
  }, []);

  const modelLoadError = useUnit($modelLoadError);

  if (modelLoadError) return <div>Failed to load model! Contact support</div>;

  return <div className="app">{missingModel ? <OnboardingPage /> : <ChatPage />}</div>;
}

export default App;
