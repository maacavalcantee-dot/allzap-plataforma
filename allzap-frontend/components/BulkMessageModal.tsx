
import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({ isOpen, onClose, contacts }) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedContacts([]);
      setMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const handleSubmit = () => {
    if (selectedContacts.length > 0 && message.trim() !== '') {
      alert(`Mensagem enviada para ${selectedContacts.length} contatos!`);
      onClose();
    } else {
      alert('Por favor, selecione ao menos um contato e escreva uma mensagem.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Disparo de Mensagem em Massa</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="p-6 flex-1 overflow-y-auto grid md:grid-cols-2 gap-6">
          {/* Contacts List */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-2">Selecione os Contatos</h3>
            <div className="border rounded-lg p-3 flex-1 overflow-y-auto">
              <div className="flex items-center pb-2 border-b mb-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-whatsapp-600 focus:ring-whatsapp-500"
                />
                <label htmlFor="select-all" className="ml-3 text-sm font-medium">Selecionar Todos</label>
              </div>
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`contact-${contact.id}`}
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="h-4 w-4 rounded border-gray-300 text-whatsapp-600 focus:ring-whatsapp-500"
                    />
                    <label htmlFor={`contact-${contact.id}`} className="ml-3 text-sm flex items-center space-x-2">
                        <img src={contact.avatarUrl} alt={contact.name} className="w-8 h-8 rounded-full" />
                        <span>{contact.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Message Area */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-2">Escreva sua Mensagem</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sua mensagem aqui..."
              rows={10}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:outline-none flex-1"
            ></textarea>
            <p className="text-xs text-slate-500 mt-1">A mensagem será enviada individualmente para cada contato.</p>
          </div>
        </div>

        <footer className="p-4 border-t flex justify-end items-center bg-slate-50 space-x-3">
          <span className="text-sm text-slate-600">{selectedContacts.length} contatos selecionados</span>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancelar</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-md bg-whatsapp-600 text-white hover:bg-whatsapp-700 font-semibold">Enviar</button>
        </footer>
      </div>
    </div>
  );
};

export default BulkMessageModal;
