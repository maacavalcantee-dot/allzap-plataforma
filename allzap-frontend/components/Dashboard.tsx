
import React, { useState } from 'react';
import type { WhatsAppAccount, Conversation, Message, MessageAttachment } from '../types';
import WhatsAppColumn from './WhatsAppColumn';
import { PlusIcon } from './icons/PlusIcon';
import QRCodeModal from './QRCodeModal';
import BackendSetupModal from './BackendSetupModal';

interface DashboardProps {
  accounts: WhatsAppAccount[];
  getConversationsForAccount: (accountId: string) => Conversation[];
  onAddAccount: () => void;
  onSendMessage: (conversationId: string, text: string, attachment?: MessageAttachment) => void;
  onUpdateAccount: (accountId: string, data: Partial<Pick<WhatsAppAccount, 'name' | 'avatarUrl' | 'description' | 'themeColor'>>) => void;
  onMarkAsRead: (conversationId: string) => void;
  onMarkAsUnread: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onEditMessage: (conversationId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  accounts, 
  getConversationsForAccount, 
  onAddAccount, 
  onSendMessage, 
  onUpdateAccount, 
  onMarkAsRead, 
  onMarkAsUnread, 
  onDeleteConversation,
  onEditMessage,
  onDeleteMessage
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  const handleConnectAccount = () => {
      onAddAccount();
  };

  return (
    <div className="flex h-full bg-slate-100 p-4 space-x-4 overflow-x-auto snap-x snap-mandatory">
      {accounts.map((account: WhatsAppAccount) => (
        <WhatsAppColumn 
          key={account.id} 
          account={account} 
          conversations={getConversationsForAccount(account.id)}
          onSendMessage={onSendMessage}
          onUpdateAccount={onUpdateAccount}
          onMarkAsRead={onMarkAsRead}
          onMarkAsUnread={onMarkAsUnread}
          onDeleteConversation={onDeleteConversation}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
        />
      ))}
       <div className="flex-shrink-0 w-full md:w-80 snap-center flex flex-col space-y-4">
         <button 
            onClick={() => setIsQRModalOpen(true)}
            className="w-full h-64 bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-white hover:border-whatsapp-500 hover:text-whatsapp-600 hover:shadow-md transition-all duration-300 group"
        >
            <div className="p-4 bg-slate-200 rounded-full mb-4 group-hover:bg-whatsapp-100 transition-colors">
                <PlusIcon className="w-8 h-8" />
            </div>
            <span className="text-lg font-semibold">Conectar Novo WhatsApp</span>
            <span className="text-sm text-slate-400 mt-1">Escaneie o QR Code</span>
         </button>

         <button 
            onClick={() => setIsBackendModalOpen(true)}
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors shadow-sm flex items-center justify-center space-x-2"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span>Instalar Backend</span>
         </button>
       </div>

       <QRCodeModal 
         isOpen={isQRModalOpen} 
         onClose={() => setIsQRModalOpen(false)}
         onConnected={handleConnectAccount}
       />
       <BackendSetupModal
         isOpen={isBackendModalOpen}
         onClose={() => setIsBackendModalOpen(false)}
       />
    </div>
  );
};

export default Dashboard;
