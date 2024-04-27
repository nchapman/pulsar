import { useEffect } from 'preact/hooks';

import { getAvailableModelsEff } from '@/entities/model/model/manage-models-model.ts';
import { ChatPage, toggleSidebar } from '@/pages/chat';
import { Toolbar } from '@/widgets/toolbar';

import { checkUpdates } from './Updates';

function App() {
  useEffect(() => {
    getAvailableModelsEff();
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
