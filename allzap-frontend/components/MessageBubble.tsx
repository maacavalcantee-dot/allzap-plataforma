
import React, { useState, useRef } from 'react';
import type { Message, MessageAttachment, AccountTheme } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { TrashIcon } from './icons/TrashIcon';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  themeColor: AccountTheme;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
}

// Mapas de cores baseados no tema
const themeStyles: Record<AccountTheme, { bubble: string; text: string; iconBg: string; linkText: string }> = {
    whatsapp: { bubble: 'bg-whatsapp-100', text: 'text-slate-800', iconBg: 'bg-whatsapp-200', linkText: 'text-whatsapp-700' },
    blue: { bubble: 'bg-blue-100', text: 'text-slate-800', iconBg: 'bg-blue-200', linkText: 'text-blue-700' },
    purple: { bubble: 'bg-purple-100', text: 'text-slate-800', iconBg: 'bg-purple-200', linkText: 'text-purple-700' },
    orange: { bubble: 'bg-orange-100', text: 'text-slate-800', iconBg: 'bg-orange-200', linkText: 'text-orange-700' },
    pink: { bubble: 'bg-pink-100', text: 'text-slate-800', iconBg: 'bg-pink-200', linkText: 'text-pink-700' },
    slate: { bubble: 'bg-slate-200', text: 'text-slate-800', iconBg: 'bg-slate-300', linkText: 'text-slate-700' },
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender, themeColor, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  
  // Audio states
  const [audioSpeed, setAudioSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const styles = themeStyles[themeColor] || themeStyles.whatsapp;
  
  const toggleAudioSpeed = () => {
      if (audioRef.current) {
          let newSpeed = 1;
          if (audioSpeed === 1) newSpeed = 1.5;
          else if (audioSpeed === 1.5) newSpeed = 2;
          
          audioRef.current.playbackRate = newSpeed;
          setAudioSpeed(newSpeed);
      }
  }

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editText.trim() !== '') {
          onEdit(message.id, editText);
          setIsEditing(false);
          setIsMenuOpen(false);
      }
  }

  const handleDelete = () => {
      if(confirm("Tem certeza que deseja apagar esta mensagem?")) {
        onDelete(message.id);
      }
  }

  const renderAttachment = (attachment: MessageAttachment) => {
    // Light theme compatible backgrounds
    const cardBg = isSender ? 'bg-white/40 border-black/5' : 'bg-black/5 border-black/5';
    const textColor = 'text-slate-800';
    const subTextColor = 'text-slate-500';
    const iconBg = isSender ? styles.iconBg : 'bg-slate-200 text-slate-500';

    if (attachment.type === 'image') {
        return (
            <div className="mb-1 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center min-h-[150px] relative group border border-slate-200">
                <img src={attachment.url} alt="Anexo" className="w-full h-auto max-h-[300px] object-cover" />
            </div>
        );
    }
    if (attachment.type === 'video') {
        return (
            <div className="mb-1 rounded-lg overflow-hidden bg-black min-h-[150px]">
                <video src={attachment.url} controls className="w-full max-h-[300px] rounded-lg" />
            </div>
        );
    }
    if (attachment.type === 'audio') {
        return (
            <div className={`flex flex-col mb-1 min-w-[260px]`}>
                <div className={`flex items-center space-x-3 p-2 rounded-lg border ${cardBg}`}>
                    <div className={`p-3 rounded-full flex-shrink-0 ${iconBg}`}>
                    <MicrophoneIcon className="w-5 h-5 opacity-70" />
                    </div>
                    <div className="flex-1">
                        <audio ref={audioRef} src={attachment.url} controls className="h-8 w-full max-w-[180px] opacity-90" />
                    </div>
                </div>
                <button 
                    onClick={toggleAudioSpeed} 
                    className={`self-end mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-slate-500 transition-colors`}
                >
                    {audioSpeed}x
                </button>
            </div>
        );
    }
    return (
        <div className={`flex items-center p-3 mb-2 rounded-lg border space-x-3 max-w-[280px] ${cardBg}`}>
            <div className={`p-3 rounded-lg shadow-sm flex-shrink-0 ${iconBg}`}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
               </svg>
            </div>
            <div className="overflow-hidden flex-1">
                <p className={`text-sm font-medium truncate ${textColor}`}>{attachment.fileName || 'Documento'}</p>
                <p className={`text-xs uppercase ${subTextColor}`}>FILE • 2 MB</p>
            </div>
        </div>
    );
  };

  return (
    <div 
        className={`flex mb-4 group ${isSender ? 'justify-end' : 'justify-start'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsMenuOpen(false); }}
    >
      <div className="relative max-w-[85%] md:max-w-md">
          
        {/* Dropdown Menu Trigger */}
        {(isHovered || isMenuOpen) && !isEditing && (
            <div className={`absolute top-0 ${isSender ? '-left-8' : '-right-8'} h-full flex pt-2 z-10`}>
                 <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-400 transition-colors"
                    >
                        <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                    {isMenuOpen && (
                        <div className={`absolute top-8 ${isSender ? 'right-0' : 'left-0'} w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 overflow-hidden flex flex-col z-20 ring-1 ring-black ring-opacity-5`}>
                            {message.text && !message.attachment && (
                                <button onClick={() => setIsEditing(true)} className="px-3 py-2 text-left text-xs hover:bg-slate-50 text-slate-700 flex items-center transition-colors">
                                    <span className="mr-2">✏️</span> Editar
                                </button>
                            )}
                            <button onClick={handleDelete} className="px-3 py-2 text-left text-xs hover:bg-red-50 text-red-500 flex items-center transition-colors">
                                <span className="mr-2"><TrashIcon className="w-3 h-3" /></span> Excluir
                            </button>
                        </div>
                    )}
                 </div>
            </div>
        )}

        {/* Message Box */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm relative border ${isSender ? `${styles.bubble} border-transparent rounded-tr-none` : 'bg-white border-white rounded-tl-none'}`}>
            
            {/* Attachment */}
            {message.attachment && renderAttachment(message.attachment)}

            {/* Text Content or Edit Form */}
            {isEditing ? (
                <form onSubmit={handleSaveEdit} className="mt-1 min-w-[200px]">
                    <input 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-slate-800 text-sm p-2 rounded bg-white focus:outline-none border border-blue-300 shadow-inner"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="text-xs underline opacity-80 hover:opacity-100 text-slate-500">Cancelar</button>
                        <button type="submit" className="text-xs font-bold bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white transition-colors">Salvar</button>
                    </div>
                </form>
            ) : (
                message.text && <p className={`text-[15px] whitespace-pre-wrap leading-relaxed ${isSender ? 'text-slate-800' : 'text-slate-800'}`}>{message.text}</p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-end mt-1 space-x-1">
                {message.isEdited && <span className={`text-[10px] italic opacity-60 ${isSender ? 'text-slate-600' : 'text-slate-400'}`}>Editado</span>}
                <p className={`text-[10px] ${isSender ? 'text-slate-500' : 'text-slate-400'}`}>{message.timestamp}</p>
                {isSender && (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 ${isSender ? 'text-blue-500' : 'text-slate-400'}`}>
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
