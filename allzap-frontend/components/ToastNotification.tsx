import React, { useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface ToastNotificationProps {
  title: string; // Aqui virá o nome do contato
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Fecha a notificação após 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  // Pega a primeira letra do nome para exibir no círculo
  const initial = title.charAt(0).toUpperCase();

  return (
    <div className="fixed top-5 right-5 w-full max-w-sm bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-right cursor-pointer" onClick={onClose}>
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
             <div className="bg-whatsapp-500 h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">{initial}</span>
             </div>
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-md font-bold text-slate-900">{title}</p>
            <p className="text-sm text-slate-600 line-clamp-1">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="inline-flex text-slate-400 rounded-md hover:text-slate-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-right {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default ToastNotification;