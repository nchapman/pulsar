import { useEffect } from 'preact/hooks';

import { initAppFolders } from '@/app/lib/initAppFolders.ts';
import { initDB } from '@/db';
import { getAvailableModelsEff } from '@/entities/model/model/manage-models-model.ts';
import { ChatPage, toggleSidebar } from '@/pages/chat';
import { loge } from '@/shared/lib/Logger';
import { Toolbar } from '@/widgets/toolbar';

import { checkUpdates } from './Updates';

function App() {
  useEffect(() => {
    const setup = async () => {
      try {
        await initAppFolders();
        await getAvailableModelsEff();
        await initDB();
        checkUpdates();
      } catch (error: any) {
        loge('App', error);
      }
    };
    setup();
  }, []);

  // TODO add a spinner or something while app is loading

  return (
    <div className="app">
      <Toolbar onToggleSidebar={toggleSidebar} />
      <ChatPage />
    </div>
  );
}

export default App;
