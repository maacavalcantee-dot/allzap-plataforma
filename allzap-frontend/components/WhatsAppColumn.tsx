
import React, { useState, useRef, useEffect } from 'react';
import type { WhatsAppAccount, Conversation, Contact, MessageAttachment, AccountTheme } from '../types';
import BulkMessageModal from './BulkMessageModal';
import FileUploadModal from './FileUploadModal';
import CustomizeAccountModal from './CustomizeAccountModal';
import ContactsModal from './ContactsModal';
import MessageBubble from './MessageBubble';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { PaperClipIcon } from './icons/UserGroupIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface WhatsAppColumnProps {
  account: WhatsAppAccount;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string, attachment?: MessageAttachment) => void;
  onUpdateAccount: (accountId: string, data: Partial<Pick<WhatsAppAccount, 'name' | 'avatarUrl' | 'description' | 'themeColor'>>) => void;
  onMarkAsRead: (conversationId: string) => void;
  onMarkAsUnread: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onEditMessage: (conversationId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
}

const findContact = (contactId: string, contacts: Contact[]): Contact | undefined => {
    return contacts.find(c => c.id === contactId);
};

// Mapas de cores para elementos da UI (Header, Botões)
const uiThemeStyles: Record<AccountTheme, { headerBg: string; buttonText: string; ring: string; activeItem: string; sidebarBorder: string }> = {
    whatsapp: { headerBg: 'bg-whatsapp-50', buttonText: 'text-whatsapp-600', ring: 'focus:ring-whatsapp-500', activeItem: 'bg-whatsapp-50', sidebarBorder: 'border-l-whatsapp-500' },
    blue: { headerBg: 'bg-blue-50', buttonText: 'text-blue-600', ring: 'focus:ring-blue-500', activeItem: 'bg-blue-50', sidebarBorder: 'border-l-blue-500' },
    purple: { headerBg: 'bg-purple-50', buttonText: 'text-purple-600', ring: 'focus:ring-purple-500', activeItem: 'bg-purple-50', sidebarBorder: 'border-l-purple-500' },
    orange: { headerBg: 'bg-orange-50', buttonText: 'text-orange-600', ring: 'focus:ring-orange-500', activeItem: 'bg-orange-50', sidebarBorder: 'border-l-orange-500' },
    pink: { headerBg: 'bg-pink-50', buttonText: 'text-pink-600', ring: 'focus:ring-pink-500', activeItem: 'bg-pink-50', sidebarBorder: 'border-l-pink-500' },
    slate: { headerBg: 'bg-slate-100', buttonText: 'text-slate-600', ring: 'focus:ring-slate-500', activeItem: 'bg-slate-200', sidebarBorder: 'border-l-slate-500' },
};

// Mapa para botão de enviar (mais forte)
const buttonThemeStyles: Record<AccountTheme, string> = {
    whatsapp: 'bg-whatsapp-500 hover:bg-whatsapp-600',
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
    pink: 'bg-pink-500 hover:bg-pink-600',
    slate: 'bg-slate-700 hover:bg-slate-800',
};

const WhatsAppColumn: React.FC<WhatsAppColumnProps> = ({ 
    account, 
    conversations, 
    onSendMessage, 
    onUpdateAccount, 
    onMarkAsRead, 
    onMarkAsUnread, 
    onDeleteConversation, 
    onEditMessage,
    onDeleteMessage
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [activeConversationId, setActiveConversationId] = useState<string | null>(isMobile ? null : (conversations[0]?.id || null));
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [isCustomizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [isContactsModalOpen, setContactsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Search States
  const [contactSearch, setContactSearch] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeContact = activeConversation ? findContact(activeConversation.contactId, account.contacts) : null;
  
  // Theme application
  const currentTheme = account.themeColor || 'whatsapp';
  const uiStyles = uiThemeStyles[currentTheme];
  const btnStyle = buttonThemeStyles[currentTheme];

  const filteredConversations = conversations.filter(conv => {
    const contact = findContact(conv.contactId, account.contacts);
    const nameMatch = !contactSearch || (contact?.name.toLowerCase().includes(contactSearch.toLowerCase()) ?? false);
    const keywordMatch = !keywordSearch || conv.messages.some(msg => 
      msg.text && msg.text.toLowerCase().includes(keywordSearch.toLowerCase())
    );
    return nameMatch && keywordMatch;
  });

  const handleSelectContact = (contactId: string) => {
    const conversation = conversations.find(conv => conv.contactId === contactId);
    if (conversation) {
      handleSelectConversation(conversation.id);
    }
    setContactsModalOpen(false);
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    onMarkAsRead(conversationId);
  };

  const handleBackToList = () => {
      setActiveConversationId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node)) {
        setIsChatMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (activeConversationId) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId, activeConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && activeConversationId) {
      onSendMessage(activeConversationId, message.trim());
      setMessage('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões do seu navegador.");
    }
  };

  const stopRecording = (shouldSend: boolean) => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);

      if (shouldSend && activeConversationId) {
        const attachment: MessageAttachment = {
            id: `aud-${Date.now()}`,
            type: 'audio',
            url: 'data:audio/mp3;base64,', // Mock empty audio
            fileName: `audio-${Date.now()}.mp3`
        };
        onSendMessage(activeConversationId, '', attachment);
      }

      setIsRecording(false);
      setRecordingDuration(0);
      mediaRecorderRef.current = null;
    }
  };

  const handleDeleteChat = () => {
    if (activeConversationId && window.confirm("Tem certeza que deseja excluir esta conversa?")) {
        onDeleteConversation(activeConversationId);
        setActiveConversationId(null);
        setIsChatMenuOpen(false);
    }
  }

  return (
    <div className="flex-shrink-0 w-full md:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden md:mr-0 snap-center border border-slate-200">
      
      {/* Account Header */}
      <header className={`flex items-center justify-between p-4 border-b ${uiStyles.headerBg} backdrop-blur-sm ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={account.avatarUrl} alt={account.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 leading-tight">{account.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{account.description || account.phone}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-white/50 transition-colors">
            <EllipsisVerticalIcon className="w-6 h-6 text-slate-600" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 py-2 border border-slate-100 animate-fade-in ring-1 ring-black ring-opacity-5">
              <button onClick={() => { setBulkModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Disparo em Massa</button>
              <button onClick={() => { setCustomizeModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Personalizar Conta</button>
               <button 
                onClick={() => {
                  if (activeConversationId) {
                    onMarkAsUnread(activeConversationId);
                    setIsMenuOpen(false);
                  }
                }} 
                disabled={!activeConversationId}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Marcar como não lida
             </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Chat List */}
        <aside className={`w-full md:w-1/3 border-r flex flex-col bg-white absolute md:relative z-10 h-full transition-transform duration-300 ${activeConversationId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
          
          {/* Contacts Button */}
          <div className="p-3 border-b bg-slate-50/50">
            <button onClick={() => setContactsModalOpen(true)} className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm text-white font-semibold ${btnStyle}`}>
                <PlusIcon className="w-5 h-5" />
                <span>Novo Chat</span>
            </button>
          </div>
          
          {/* Search Area */}
          <div className="bg-slate-50/50 flex flex-col p-2 space-y-2 border-b">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className={`block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${uiStyles.ring} sm:text-sm transition-shadow`}
                        placeholder="Buscar pessoa..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className={`block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${uiStyles.ring} sm:text-sm transition-shadow`}
                        placeholder="Buscar na conversa..."
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                    />
                </div>
          </div>

          <ul className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
                filteredConversations.map(conv => {
                const contact = findContact(conv.contactId, account.contacts);
                const lastMsg = conv.messages[conv.messages.length - 1];
                const previewText = lastMsg?.attachment 
                    ? (lastMsg.attachment.type === 'audio' ? '🎤 Mensagem de voz' : lastMsg.attachment.type === 'image' ? '📷 Foto' : '📎 Arquivo') 
                    : lastMsg?.text;

                const isActive = activeConversationId === conv.id;

                return (
                    <li key={conv.id}>
                    <button 
                        onClick={() => handleSelectConversation(conv.id)} 
                        className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-slate-50 transition-colors border-l-4 ${isActive ? `${uiStyles.activeItem} ${uiStyles.sidebarBorder}` : 'border-transparent'}`}
                    >
                        <div className="relative">
                            <img src={contact?.avatarUrl} alt={contact?.name} className="w-12 h-12 rounded-full border border-slate-100"/>
                            {conv.unreadCount && conv.unreadCount > 0 ? (
                                <span className={`absolute -top-1 -right-1 ${btnStyle} text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm`}>
                                    {conv.unreadCount}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                                <p className={`font-semibold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{contact?.name}</p>
                                <span className="text-[10px] text-slate-400">{lastMsg?.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-500 truncate font-medium">{previewText}</p>
                        </div>
                    </button>
                    </li>
                );
                })
            ) : (
                <li className="p-8 text-center text-sm text-slate-500 flex flex-col items-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-3">
                        <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    Nenhuma conversa encontrada.
                </li>
            )}
          </ul>
        </aside>

        {/* Chat Window - LIGHT THEME MODERN */}
        <main className={`w-full md:w-2/3 flex flex-col absolute md:relative h-full bg-[#efeae2] transition-transform duration-300 ${activeConversationId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          {activeConversation && activeContact ? (
            <>
              {/* Chat Header - LIGHT */}
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-20">
                  <div className="flex items-center space-x-3">
                    {/* Back Button for Mobile */}
                    <button onClick={handleBackToList} className="md:hidden p-1 rounded-full hover:bg-slate-100 text-slate-600">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                       </svg>
                    </button>

                    <img src={activeContact.avatarUrl} alt={activeContact.name} className="w-10 h-10 rounded-full shadow-sm border border-slate-200"/>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-slate-800 leading-none">{activeContact.name}</h3>
                        <span className="text-xs text-slate-500 mt-1">Online hoje às 10:30</span>
                    </div>
                  </div>
                  <div className="relative" ref={chatMenuRef}>
                    <button onClick={() => setIsChatMenuOpen(!isChatMenuOpen)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                       <EllipsisVerticalIcon className="w-6 h-6" />
                    </button>
                    {isChatMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-2 border border-slate-100 animate-fade-in ring-1 ring-black ring-opacity-5">
                           <button onClick={() => alert("Bloqueado")} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Bloquear contato</button>
                           <button onClick={handleDeleteChat} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Excluir conversa</button>
                        </div>
                    )}
                  </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent bg-opacity-50">
                {activeConversation.messages.map(msg => (
                    <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isSender={msg.sender === 'user'}
                        themeColor={currentTheme}
                        onEdit={(id, txt) => onEditMessage(activeConversation.id, id, txt)}
                        onDelete={(id) => onDeleteMessage(activeConversation.id, id)}
                    />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - LIGHT */}
              <div className="p-3 bg-white border-t border-slate-200">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-50 p-2 rounded-full shadow-inner animate-pulse border border-red-100">
                     <div className="flex items-center text-red-500 space-x-2 pl-3">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                        <span className="font-mono font-medium">{formatTime(recordingDuration)}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => stopRecording(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors">
                           <TrashIcon className="w-6 h-6" />
                        </button>
                        <button onClick={() => stopRecording(true)} className={`p-2 ${btnStyle} text-white rounded-full transition-colors shadow-md`}>
                           <CheckIcon className="w-6 h-6" />
                        </button>
                     </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <button type="button" onClick={() => setFileModalOpen(true)} className="p-2 rounded-full hover:bg-slate-100 transition-colors hidden md:block text-slate-500">
                      <PaperClipIcon className="w-6 h-6" />
                    </button>
                    <button type="button" onClick={() => setFileModalOpen(true)} className="p-2 rounded-full hover:bg-slate-100 transition-colors md:hidden text-slate-500">
                       <PlusIcon className="w-6 h-6" />
                    </button>

                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mensagem" 
                      className={`flex-1 p-3 border-none rounded-full focus:outline-none focus:ring-2 ${uiStyles.ring} text-sm bg-slate-100 text-slate-800 placeholder-slate-400 transition-all`}
                    />
                    {message.trim() ? (
                      <button type="submit" className={`${btnStyle} text-white p-3 rounded-full transition-all transform hover:scale-105 shadow-md flex-shrink-0`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
                      </button>
                    ) : (
                        <button type="button" onClick={startRecording} className="p-3 rounded-full hover:bg-slate-100 transition-colors text-slate-500 flex-shrink-0">
                            <MicrophoneIcon className="w-6 h-6" />
                        </button>
                    )}
                  </form>
                )}
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-[#efeae2] border-l border-slate-200 text-center p-8">
                <div className="bg-white p-6 rounded-full shadow-lg mb-6 animate-pulse">
                    <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="Chat" className="w-24 h-24 opacity-30" />
                </div>
                <h3 className="text-2xl font-light text-slate-600">Allzap Web</h3>
                <p className="text-slate-500 mt-2 max-w-md">Selecione uma conversa para começar a enviar mensagens. Conecte múltiplas contas e gerencie tudo por aqui.</p>
                <div className="mt-8 flex items-center space-x-2 text-slate-400 text-xs">
                    <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                    <span>Criptografia de ponta a ponta</span>
                </div>
             </div>
          )}
        </main>
      </div>

      <BulkMessageModal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} contacts={account.contacts} />
      <FileUploadModal isOpen={isFileModalOpen} onClose={() => setFileModalOpen(false)} files={account.files} />
      <CustomizeAccountModal isOpen={isCustomizeModalOpen} onClose={() => setCustomizeModalOpen(false)} account={account} onSave={onUpdateAccount} />
      <ContactsModal isOpen={isContactsModalOpen} onClose={() => setContactsModalOpen(false)} contacts={account.contacts} onSelectContact={handleSelectContact} />
    </div>
  );
};

export default WhatsAppColumn;
