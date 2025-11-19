import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WorkflowBoard from './components/WorkflowBoard';
import ReportsBoard from './components/ReportsBoard';
import ToastNotification from './components/ToastNotification';
import { useMockData } from './hooks/useMockData';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [notification, setNotification] = useState<{ title: string, message: string } | null>(null);
  const {
    accounts,
    workflowStages,
    getConversationsForAccount,
    getConversationsForStage,
    handleDrop,
    addAccount,
    sendMessage,
    editMessage,
    deleteMessage,
    updateAccount,
    receiveNewMessage,
    markConversationAsRead,
    markConversationAsUnread,
    deleteConversation,
  } = useMockData();

  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const originalTitle = useRef(document.title);

  useEffect(() => {
    // Carrega o áudio de notificação
    notificationAudioRef.current = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGliAv4/GgA+MRBACH/v+4ADWM4lYtSt2/v/74AAn9gAABkUG3QGAApUaWEAAG4bEsSCIQgQ/+AAGTIAQwAADP/7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAACjQyQBAAD/7+MB4AAA4AMAgAAApAYoJ0A//8xAYIAAAsEAAD/8jAAAAwAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  }, []);
  
  useEffect(() => {
     const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        document.title = originalTitle.current;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { newMessage, contact } = receiveNewMessage();
      if (newMessage && contact) {
        // Título apenas com o nome, conforme solicitado
        setNotification({
          title: contact.name,
          message: newMessage.text,
        });
        notificationAudioRef.current?.play().catch(e => console.error("Erro ao tocar áudio:", e));

        if (document.hidden) {
          document.title = `(1) ${originalTitle.current}`;
        }
      }
    }, 15000); // Simula nova mensagem a cada 15 segundos

    return () => clearInterval(intervalId);
  }, [receiveNewMessage]);

  return (
    <div className="flex flex-col h-screen font-sans text-slate-800">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-hidden bg-slate-100">
        {currentView === 'dashboard' && (
          <Dashboard 
            accounts={accounts} 
            getConversationsForAccount={getConversationsForAccount} 
            onAddAccount={addAccount}
            onSendMessage={sendMessage}
            onUpdateAccount={updateAccount}
            onMarkAsRead={markConversationAsRead}
            onMarkAsUnread={markConversationAsUnread}
            onDeleteConversation={deleteConversation}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
          />
        )}
        {currentView === 'workflow' && (
          <WorkflowBoard
            accounts={accounts}
            stages={workflowStages}
            getConversationsForStage={getConversationsForStage}
            onDrop={handleDrop}
          />
        )}
        {currentView === 'reports' && (
          <ReportsBoard />
        )}
      </main>
      {notification && (
        <ToastNotification
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default App;