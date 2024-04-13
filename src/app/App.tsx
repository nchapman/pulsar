import { ChatPage, toggleSidebar } from '@/pages/chat';
import { Toolbar } from '@/widgets/toolbar';

function App() {
  return (
    <div className="app">
      <Toolbar onToggleSidebar={toggleSidebar} />
      <ChatPage />
    </div>
  );
}

export default App;
