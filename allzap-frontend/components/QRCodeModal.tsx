
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, onConnected }) => {
  const [step, setStep] = useState<'generating' | 'waiting' | 'connecting' | 'success'>('generating');

  useEffect(() => {
    if (isOpen) {
      setStep('generating');
      // Simula geração do QR Code
      const timer1 = setTimeout(() => setStep('waiting'), 800);
      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  const handleSimulateScan = () => {
    setStep('connecting');
    // Simula o tempo de conexão e sincronização de mensagens
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onConnected();
            onClose();
        }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row h-[80vh] max-h-[600px] overflow-hidden animate-fade-in">
        
        {/* Lado Esquerdo: Instruções */}
        <div className="p-8 md:w-2/3 flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-light text-slate-700">Use o WhatsApp no seu computador</h2>
            <ol className="list-decimal ml-5 space-y-4 text-lg text-slate-600 leading-relaxed">
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em <strong>Mais opções</strong> (três pontinhos) no Android ou <strong>Configurações</strong> no iPhone</li>
                <li>Toque em <strong>Aparelhos conectados</strong> e depois em <strong>Conectar um aparelho</strong></li>
                <li>Aponte seu celular para esta tela para capturar o código</li>
            </ol>
            <div className="mt-8 text-whatsapp-600 font-medium cursor-pointer hover:underline">
                Precisa de ajuda para começar?
            </div>
        </div>

        {/* Lado Direito: QR Code */}
        <div className="md:w-1/3 border-l border-slate-200 p-8 flex flex-col items-center justify-center bg-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="relative group">
                {step === 'generating' && (
                    <div className="w-64 h-64 flex items-center justify-center bg-slate-100 rounded-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-600"></div>
                    </div>
                )}

                {step === 'waiting' && (
                    <>
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                            alt="QR Code" 
                            className="w-64 h-64 opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="mt-6 text-center">
                             <button 
                                onClick={handleSimulateScan}
                                className="bg-whatsapp-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-whatsapp-700 transition-transform transform hover:scale-105"
                             >
                                Simular Leitura do QR Code
                             </button>
                             <p className="text-xs text-slate-400 mt-2">(Apenas para demonstração)</p>
                        </div>
                    </>
                )}

                {step === 'connecting' && (
                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-white rounded-lg space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-whatsapp-600"></div>
                        <p className="text-slate-600 font-medium animate-pulse">Conectando e baixando mensagens...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-white rounded-lg space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                        <p className="text-green-700 font-bold text-lg">Conectado!</p>
                    </div>
                )}
            </div>
            
            {step === 'waiting' && (
                <div className="flex items-center space-x-2 mt-8">
                    <input type="checkbox" id="keep-connected" className="rounded text-whatsapp-600 focus:ring-whatsapp-500" defaultChecked />
                    <label htmlFor="keep-connected" className="text-sm text-slate-600">Manter conectado</label>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QRCodeModal;
