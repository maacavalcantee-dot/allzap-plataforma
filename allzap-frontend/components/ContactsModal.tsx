import React, { useState } from 'react';
import type { Contact } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onSelectContact: (contactId: string) => void;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose, contacts, onSelectContact }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col h-[70vh]">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Contatos</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Buscar contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-slate-100 focus:ring-2 focus:ring-whatsapp-500 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            <ul>
              {filteredContacts.map(contact => (
                <li key={contact.id}>
                  <button
                    onClick={() => onSelectContact(contact.id)}
                    className="w-full text-left p-3 flex items-center space-x-3 hover:bg-slate-100 transition-colors"
                  >
                    <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-slate-500">{contact.phone}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500 p-6">Nenhum contato encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;