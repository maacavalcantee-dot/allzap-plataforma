
import React, { useState } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface BackendSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackendSetupModal: React.FC<BackendSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const batchContent = `@echo off
SETLOCAL
echo ==========================================
echo      ALLZAP BACKEND INSTALLER
echo ==========================================
echo.

:: 1. Check Node Version
echo [1/4] Verificando Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado. Instale o Node.js em https://nodejs.org/
    pause
    exit /b
)
echo Node.js detectado.
echo.

:: 2. Create package.json if not exists
echo [2/4] Configurando package.json...
if not exist package.json (
    echo { > package.json
    echo   "name": "allzap-backend", >> package.json
    echo   "version": "1.0.0", >> package.json
    echo   "description": "Backend API for Allzap", >> package.json
    echo   "main": "server.js", >> package.json
    echo   "scripts": { >> package.json
    echo     "start": "node server.js", >> package.json
    echo     "dev": "nodemon server.js" >> package.json
    echo   }, >> package.json
    echo   "dependencies": { >> package.json
    echo     "express": "^4.18.2", >> package.json
    echo     "cors": "^2.8.5", >> package.json
    echo     "socket.io": "^4.7.4", >> package.json
    echo     "whatsapp-web.js": "^1.23.0", >> package.json
    echo     "qrcode-terminal": "^0.12.0" >> package.json
    echo   }, >> package.json
    echo   "devDependencies": { >> package.json
    echo     "nodemon": "^3.0.3" >> package.json
    echo   } >> package.json
    echo } >> package.json
    echo package.json criado com sucesso.
) else (
    echo package.json ja existe. Pulando criacao.
)
echo.

:: 3. Create server.js if not exists
echo [3/4] Criando arquivo do servidor (server.js)...
if not exist server.js (
    echo const express = require('express'); > server.js
    echo const http = require('http'); >> server.js
    echo const { Server } = require('socket.io'); >> server.js
    echo const cors = require('cors'); >> server.js
    echo const { Client, LocalAuth } = require('whatsapp-web.js'); >> server.js
    echo. >> server.js
    echo const app = express(); >> server.js
    echo app.use(cors()); >> server.js
    echo. >> server.js
    echo const server = http.createServer(app); >> server.js
    echo const io = new Server(server, { >> server.js
    echo   cors: { origin: "*", methods: ["GET", "POST"] } >> server.js
    echo }); >> server.js
    echo. >> server.js
    echo const client = new Client({ >> server.js
    echo     authStrategy: new LocalAuth(), >> server.js
    echo     puppeteer: { args: ['--no-sandbox'] } >> server.js
    echo }); >> server.js
    echo. >> server.js
    echo client.on('qr', (qr) =^> { >> server.js
    echo     console.log('QR Code received', qr); >> server.js
    echo     io.emit('qr', qr); >> server.js
    echo }); >> server.js
    echo. >> server.js
    echo client.on('ready', () =^> { >> server.js
    echo     console.log('Client is ready!'); >> server.js
    echo     io.emit('ready', 'WhatsApp Connected'); >> server.js
    echo }); >> server.js
    echo. >> server.js
    echo client.on('message', msg =^> { >> server.js
    echo     if (msg.body == '!ping') { >> server.js
    echo         msg.reply('pong'); >> server.js
    echo     } >> server.js
    echo }); >> server.js
    echo. >> server.js
    echo client.initialize(); >> server.js
    echo. >> server.js
    echo server.listen(3001, () =^> { >> server.js
    echo   console.log('SERVER RUNNING ON PORT 3001'); >> server.js
    echo }); >> server.js
    echo server.js criado com sucesso.
) else (
    echo server.js ja existe. Pulando criacao.
)
echo.

:: 4. Install Dependencies
echo [4/4] Instalando dependencias (pode demorar um pouco)...
call npm install
echo.

echo ==========================================
echo      INSTALACAO CONCLUIDA!
echo ==========================================
echo.
echo Para iniciar o servidor, digite: npm start
echo.
pause`;

  const handleCopy = () => {
    navigator.clipboard.writeText(batchContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-fade-in">
        <header className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Instalação do Backend</h2>
            <p className="text-slate-500 text-sm mt-1">Siga os passos abaixo para configurar o servidor local.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </header>
        
        <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start">
                    <div className="bg-slate-100 text-slate-600 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">1</div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Crie a pasta</h3>
                        <p className="text-slate-600 mt-1">Crie uma pasta no seu computador chamada <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-sm">allzap-backend</code> e abra-a.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start">
                    <div className="bg-slate-100 text-slate-600 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">2</div>
                    <div className="w-full">
                        <h3 className="font-bold text-lg text-slate-800">Crie o instalador</h3>
                        <p className="text-slate-600 mt-1 mb-3">Copie o código abaixo, crie um arquivo de texto na pasta, cole o código e salve como <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-sm">instalar.bat</code>.</p>
                        
                        <div className="relative">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed border border-slate-700 max-h-64 overflow-y-auto custom-scrollbar">
                                {batchContent}
                            </pre>
                            <button 
                                onClick={handleCopy} 
                                className={`absolute top-3 right-3 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {copied ? 'Copiado!' : 'Copiar Código'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start">
                    <div className="bg-slate-100 text-slate-600 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">3</div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Execute</h3>
                        <p className="text-slate-600 mt-1">Dê dois cliques no arquivo <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-sm">instalar.bat</code>. Ele irá configurar tudo automaticamente.</p>
                    </div>
                </div>
            </div>
        </div>

        <footer className="p-4 border-t bg-slate-50 flex justify-end rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition-colors">
            Fechar
          </button>
        </footer>
      </div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default BackendSetupModal;
