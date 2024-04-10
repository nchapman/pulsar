import { useEffect } from 'preact/hooks';

import { ChatPage } from '@/pages/chat';

import { checkUpdates } from './Updates';

function App() {
  useEffect(() => {
    checkUpdates();
  }, []);

  return (
    <div className="app">
      <ChatPage />
    </div>
  );
}

export default App;
