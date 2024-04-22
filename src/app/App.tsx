import { useEffect } from 'preact/hooks';

import { ChatPage, toggleSidebar } from '@/pages/chat';
import { Toolbar } from '@/widgets/toolbar';

import { checkUpdates } from './Updates';

function App() {
  useEffect(() => {
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
