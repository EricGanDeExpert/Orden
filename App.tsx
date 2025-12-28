
import React, { useState } from 'react';
import { View } from './types';
import Layout from './components/Layout';
import ChatView from './views/ChatView';
import FolderView from './views/FolderView';
import ProfileView from './views/ProfileView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CHAT);

  const renderView = () => {
    switch (activeView) {
      case View.CHAT:
        return <ChatView />;
      case View.NOTES:
        return <FolderView />;
      case View.PROFILE:
        return <ProfileView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
