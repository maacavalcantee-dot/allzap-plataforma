
import React, { useState } from 'react';
import type { UploadedFile } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { PaperClipIcon, UserGroupIcon } from './icons/UserGroupIcon';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: UploadedFile[];
}

const FileIcon: React.FC<{ type: UploadedFile['type'] }> = ({ type }) => {
    const iconClasses = "w-8 h-8";
    if (type === 'image') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconClasses} text-blue-500`}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
    if (type === 'video') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconClasses} text-red-500`}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>;
    if (type === 'audio') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconClasses} text-purple-500`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconClasses} text-green-500`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, files: initialFiles }) => {
  const [files, setFiles] = useState(initialFiles);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Gerenciador de Arquivos</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center mb-6">
            <PaperClipIcon className="w-12 h-12 mx-auto text-slate-400" />
            <p className="mt-2 text-slate-600">Arraste e solte arquivos aqui ou</p>
            <label htmlFor="file-upload" className="cursor-pointer mt-2 inline-block bg-whatsapp-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-whatsapp-700 transition-colors">
              Selecione os Arquivos
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
            <p className="text-xs text-slate-400 mt-2">Áudio, foto, vídeo e planilhas</p>
          </div>

          {/* File List */}
          <div>
            <h3 className="font-semibold mb-3">Arquivos da Conta</h3>
            <div className="space-y-2">
              {files.length > 0 ? files.map(file => (
                <div key={file.id} className="flex items-center p-2 bg-slate-50 rounded-lg">
                  <FileIcon type={file.type} />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size}</p>
                  </div>
                  <button className="p-1.5 rounded-full hover:bg-slate-200">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </div>
              )) : (
                <p className="text-center text-slate-500 py-4">Nenhum arquivo encontrado.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="p-4 border-t bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Fechar</button>
        </footer>
      </div>
    </div>
  );
};

export default FileUploadModal;
