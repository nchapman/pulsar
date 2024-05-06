import { useEffect } from 'preact/hooks';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import { getAvailableModelsEff } from '@/entities/model/model/manage-models-model.ts';
import { ChatPage, toggleSidebar } from '@/pages/chat';
import { initTheme } from '@/shared/theme';
import { Toolbar } from '@/widgets/toolbar';

import { checkUpdates } from './Updates';

function App() {
  initTheme();
  useEffect(() => {
    initAppFolders().then(() => getAvailableModelsEff());
    checkUpdates();
  }, []);

  return (
    <div className="app">
      <Toolbar onToggleSidebar={toggleSidebar} />
      <ChatPage />
    </div>
  );
}

export default App;
