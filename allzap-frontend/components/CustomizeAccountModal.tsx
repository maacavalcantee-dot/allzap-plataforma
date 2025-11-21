import React, { useState, useEffect } from 'react';
import type { WhatsAppAccount, AccountTheme } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface CustomizeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: WhatsAppAccount;
  onSave: (accountId: string, data: Partial<Pick<WhatsAppAccount, 'name' | 'avatarUrl' | 'description' | 'themeColor'>>) => void;
}

const themeOptions: { value: AccountTheme; label: string; colorClass: string }[] = [
  { value: 'whatsapp', label: 'Padrão (Verde)', colorClass: 'bg-whatsapp-500' },
  { value: 'blue', label: 'Azul Corporativo', colorClass: 'bg-blue-500' },
  { value: 'purple', label: 'Roxo Criativo', colorClass: 'bg-purple-500' },
  { value: 'orange', label: 'Laranja Vibrante', colorClass: 'bg-orange-500' },
  { value: 'pink', label: 'Rosa Suave', colorClass: 'bg-pink-500' },
  { value: 'slate', label: 'Cinza Neutro', colorClass: 'bg-slate-500' },
];

const CustomizeAccountModal: React.FC<CustomizeAccountModalProps> = ({ isOpen, onClose, account, onSave }) => {
  const [name, setName] = useState(account.name);
  const [avatarUrl, setAvatarUrl] = useState(account.avatarUrl);
  const [description, setDescription] = useState(account.description || '');
  const [themeColor, setThemeColor] = useState<AccountTheme>(account.themeColor || 'whatsapp');

  useEffect(() => {
    if (isOpen) {
      setName(account.name);
      setAvatarUrl(account.avatarUrl);
      setDescription(account.description || '');
      setThemeColor(account.themeColor || 'whatsapp');
    }
  }, [isOpen, account]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(account.id, { name, avatarUrl, description, themeColor });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in">
        <header className="p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800">Personalizar Conta</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </header>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          
          {/* Cor do Tema */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-3">Cor do Tema</label>
             <div className="grid grid-cols-3 gap-3">
               {themeOptions.map((theme) => (
                 <button
                    key={theme.value}
                    type="button"
                    onClick={() => setThemeColor(theme.value)}
                    className={`flex items-center p-2 rounded-lg border-2 transition-all ${themeColor === theme.value ? 'border-slate-600 bg-slate-50' : 'border-transparent hover:bg-slate-50'}`}
                 >
                    <div className={`w-6 h-6 rounded-full ${theme.colorClass} mr-2 shadow-sm`}></div>
                    <span className="text-sm text-slate-600">{theme.label}</span>
                 </button>
               ))}
             </div>
          </div>

          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome da Conta
            </label>
            <input
              type="text"
              id="account-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:outline-none bg-slate-50"
            />
          </div>
          <div>
            <label htmlFor="avatar-url" className="block text-sm font-medium text-slate-700 mb-1">
              URL da Foto de Perfil
            </label>
            <div className="flex items-center space-x-3">
                <img src={avatarUrl} alt="Preview" className="w-10 h-10 rounded-full border bg-slate-100" />
                <input
                type="text"
                id="avatar-url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:outline-none bg-slate-50"
                />
            </div>
          </div>
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-whatsapp-500 focus:outline-none bg-slate-50"
              placeholder="Uma breve descrição sobre esta conta..."
            ></textarea>
          </div>
        </div>

        <footer className="p-5 border-t flex justify-end items-center bg-slate-50 space-x-3 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-all shadow-sm">Cancelar</button>
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 font-semibold transition-all shadow-lg shadow-slate-300">Salvar Alterações</button>
        </footer>
      </form>
    </div>
  );
};

export default CustomizeAccountModal;