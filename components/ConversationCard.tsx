
import React from 'react';
import type { Conversation, Contact } from '../types';

// Mock function as we don't have access to the full contacts list here
// In a real app, you would fetch this from a context or a store.
const getMockContactForCard = (contactId: string): Partial<Contact> => {
    const contacts: { [key: string]: Partial<Contact> } = {
        'c1': { name: 'Ana Silva', avatarUrl: 'https://i.pravatar.cc/150?u=c1' },
        'c2': { name: 'Bruno Costa', avatarUrl: 'https://i.pravatar.cc/150?u=c2' },
        'c3': { name: 'Carla Dias', avatarUrl: 'https://i.pravatar.cc/150?u=c3' },
        'c4': { name: 'Daniel Alves', avatarUrl: 'https://i.pravatar.cc/150?u=c4' },
    }
    return contacts[contactId] || { name: 'Unknown Contact', avatarUrl: 'https://i.pravatar.cc/150?u=unknown'};
}


interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('conversationId', conversation.id);
  };

  const contact = getMockContactForCard(conversation.contactId);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-whatsapp-200 transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
            <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
            {conversation.unreadCount && conversation.unreadCount > 0 ? (
               <span className="absolute -top-1 -right-1 bg-whatsapp-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                  {conversation.unreadCount}
               </span>
            ) : null}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-bold text-slate-800 text-sm truncate group-hover:text-whatsapp-700 transition-colors">{contact.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{lastMessage?.timestamp}</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {lastMessage?.text || <span className="italic text-slate-400">Sem mensagem</span>}
          </p>
      </div>
    </div>
  );
};

export default ConversationCard;
