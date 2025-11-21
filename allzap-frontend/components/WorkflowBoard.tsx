
import React, { useState } from 'react';
import type { WorkflowStage, Conversation, WhatsAppAccount } from '../types';
import WorkflowColumn from './WorkflowColumn';

interface WorkflowBoardProps {
  accounts: WhatsAppAccount[];
  stages: WorkflowStage[];
  getConversationsForStage: (stageId: string, accountId?: string) => Conversation[];
  onDrop: (conversationId: string, newStageId: string) => void;
}

const WorkflowBoard: React.FC<WorkflowBoardProps> = ({ accounts, stages, getConversationsForStage, onDrop }) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedAccountId(e.target.value);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Barra de Seleção de Conta Modernizada */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm flex items-center space-x-6 z-10 sticky top-0">
        <div className="flex items-center space-x-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-whatsapp-600">
              <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
           </svg>
           <h2 className="text-xl font-bold text-slate-800 tracking-tight">Workflow CRM</h2>
        </div>
        
        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <label htmlFor="account-selector" className="text-xs font-bold text-slate-500 uppercase px-2">
                Filtrar por Conta:
            </label>
            <div className="relative">
                <select 
                    id="account-selector"
                    value={selectedAccountId}
                    onChange={handleAccountChange}
                    className="appearance-none bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-whatsapp-500 focus:border-whatsapp-500 block w-56 p-2 pr-8 font-medium shadow-sm cursor-pointer hover:border-whatsapp-400 transition-colors"
                >
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
      </div>

      {/* Colunas do Kanban */}
      <div 
        className="flex-1 p-6 space-x-6 overflow-x-auto flex items-start bg-slate-50/50"
        onDragOver={handleDragOver}
      >
        {stages.map(stage => (
          <WorkflowColumn
            key={stage.id}
            stage={stage}
            conversations={getConversationsForStage(stage.id, selectedAccountId)}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowBoard;
