import { useState, useCallback } from 'react';
import type { WhatsAppAccount, Conversation, WorkflowStage, Contact, Message, UploadedFile, MessageAttachment, AccountTheme } from '../types';

const initialContacts: Contact[] = [
  { id: 'c1', name: 'Ana Silva', phone: '+55 11 98765-4321', avatarUrl: 'https://i.pravatar.cc/150?u=c1' },
  { id: 'c2', name: 'Bruno Costa', phone: '+55 21 91234-5678', avatarUrl: 'https://i.pravatar.cc/150?u=c2' },
  { id: 'c3', name: 'Carla Dias', phone: '+55 31 98888-7777', avatarUrl: 'https://i.pravatar.cc/150?u=c3' },
  { id: 'c4', name: 'Daniel Alves', phone: '+55 41 99999-6666', avatarUrl: 'https://i.pravatar.cc/150?u=c4' },
];

const initialConversations: Conversation[] = [
  { 
    id: 'conv1', 
    contactId: 'c1', 
    messages: [
        { id: 'm1', text: 'Olá, gostaria de um orçamento.', timestamp: '10:30', sender: 'contact' },
        { 
            id: 'm1-img', 
            text: 'Gostaria de algo parecido com isso aqui:', 
            timestamp: '10:31', 
            sender: 'contact',
            attachment: {
                id: 'att1',
                type: 'image',
                url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                fileName: 'referencia.jpg'
            }
        }
    ], 
    workflowStageId: 's3', 
    unreadCount: 1 
  },
  { 
    id: 'conv2', 
    contactId: 'c2', 
    messages: [
        { id: 'm2', text: 'Podemos marcar uma reunião?', timestamp: '11:15', sender: 'contact' },
        {
            id: 'm2-doc',
            text: 'Segue o briefing do projeto.',
            timestamp: '11:16',
            sender: 'contact',
            attachment: {
                id: 'att2',
                type: 'file',
                url: '#',
                fileName: 'briefing_projeto_v2.pdf'
            }
        }
    ], 
    workflowStageId: 's2' 
  },
  { id: 'conv3', contactId: 'c3', messages: [{ id: 'm3', text: 'Contrato assinado! Obrigado.', timestamp: '09:05', sender: 'contact' }], workflowStageId: 's4' },
  { id: 'conv4', contactId: 'c4', messages: [{ id: 'm4', text: 'Vou pensar e te retorno.', timestamp: '14:50', sender: 'contact' }], workflowStageId: 's7', unreadCount: 2 },
];

const initialFiles: UploadedFile[] = [
    { id: 'f1', name: 'proposta_comercial.pdf', type: 'spreadsheet', url: '#', size: '2.5 MB' },
    { id: 'f2', name: 'video_demonstracao.mp4', type: 'video', url: '#', size: '15.1 MB' },
]

const initialAccounts: WhatsAppAccount[] = [
  { id: 'acc1', name: 'Vendas Principal', phone: '+55 11 91111-1111', avatarUrl: 'https://i.pravatar.cc/150?u=acc1', contacts: initialContacts, files: initialFiles, description: 'Conta primária para prospecção e vendas.', themeColor: 'whatsapp' },
  { id: 'acc2', name: 'Suporte Técnico', phone: '+55 11 92222-2222', avatarUrl: 'https://i.pravatar.cc/150?u=acc2', contacts: [initialContacts[0], initialContacts[2]], files: [], description: 'Canal de suporte para clientes existentes.', themeColor: 'blue' },
];

const initialWorkflowStages: WorkflowStage[] = [
  { id: 's1', title: 'Assunto pessoal' },
  { id: 's2', title: 'Novo Lead' },
  { id: 's3', title: 'Orçamento em aberto' },
  { id: 's4', title: 'Casamento Agendado' },
  { id: 's5', title: 'Evento Corporativo Agendado' },
  { id: 's6', title: 'Barzinho' },
  { id: 's7', title: 'Pediu orçamento e não fechou' },
];

const possibleReplies = [
    "Ok, entendido. Vou verificar.",
    "Pode me dar mais detalhes?",
    "Recebido, obrigado!",
    "Claro, já estou analisando.",
    "Interessante, vamos conversar sobre isso."
];

export const useMockData = () => {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>(initialAccounts);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const workflowStages = initialWorkflowStages;

  const getConversationsForAccount = (accountId: string) => {
      const account = accounts.find(acc => acc.id === accountId);
      if(!account) return [];
      const accountContactIds = account.contacts.map(c => c.id);
      return conversations.filter(c => accountContactIds.includes(c.contactId));
  };

  const getConversationsForStage = (stageId: string, accountId?: string) => {
    let filtered = conversations.filter(c => c.workflowStageId === stageId);
    
    if (accountId) {
        const account = accounts.find(acc => acc.id === accountId);
        if (account) {
            const accountContactIds = account.contacts.map(c => c.id);
            filtered = filtered.filter(c => accountContactIds.includes(c.contactId));
        }
    }
    
    return filtered;
  };

  const handleDrop = (conversationId: string, newStageId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, workflowStageId: newStageId } : c))
    );
  };
    
  const addAccount = () => {
    const newId = `acc${accounts.length + 1}`;
    const accountNames = ["Comercial Externo", "Atendimento N1", "Gerência", "Marketing", "Pós-Venda"];
    const randomName = accountNames[Math.floor(Math.random() * accountNames.length)];
    
    const newAccount: WhatsAppAccount = {
      id: newId,
      name: `${randomName}`,
      phone: `+55 11 9${Math.floor(10000000 + Math.random() * 90000000)}`,
      avatarUrl: `https://i.pravatar.cc/150?u=${newId}`,
      contacts: [],
      files: [],
      description: 'Conta conectada via QR Code.',
      themeColor: 'whatsapp'
    };
    setAccounts(prev => [...prev, newAccount]);
  };
  
  const _addMessageToConversation = (conversationId: string, message: Message) => {
     setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
            const newUnreadCount = message.sender === 'contact' 
                ? (conv.unreadCount || 0) + 1 
                : conv.unreadCount;

            return {
                ...conv,
                messages: [...conv.messages, message],
                unreadCount: newUnreadCount,
            }
        }
        return conv;
    }));
  }

  const sendMessage = (conversationId: string, text: string, attachment?: MessageAttachment) => {
    const newMessage: Message = {
        id: `m${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        attachment
    };
    _addMessageToConversation(conversationId, newMessage);
  };
  
  const editMessage = (conversationId: string, messageId: string, newText: string) => {
      setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
              return {
                  ...conv,
                  messages: conv.messages.map(msg => 
                    msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg
                  )
              }
          }
          return conv;
      }));
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
      setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
              return {
                  ...conv,
                  messages: conv.messages.filter(msg => msg.id !== messageId)
              }
          }
          return conv;
      }));
  };

  const updateAccount = (accountId: string, data: Partial<Pick<WhatsAppAccount, 'name' | 'avatarUrl' | 'description' | 'themeColor'>>) => {
      setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, ...data } : acc));
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const markConversationAsUnread = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 1 } : c))
    );
  };
  
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
  };
  
  const receiveNewMessage = useCallback(() => {
    if (conversations.length === 0) return {};
    
    const randomConvIndex = Math.floor(Math.random() * conversations.length);
    const targetConversation = conversations[randomConvIndex];
    
    const targetAccount = accounts.find(acc => acc.contacts.some(c => c.id === targetConversation.contactId));
    if (!targetAccount) return {};

    const contact = targetAccount.contacts.find(c => c.id === targetConversation.contactId);
    if (!contact) return {};
    
    const randomReply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
    const newMessage: Message = {
        id: `m${Date.now()}`,
        text: randomReply,
        sender: 'contact',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    _addMessageToConversation(targetConversation.id, newMessage);
    
    return { newMessage, contact, account: targetAccount };
  }, [conversations, accounts]);


  return {
    accounts,
    conversations,
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
  };
};