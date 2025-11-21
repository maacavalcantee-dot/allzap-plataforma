
import React from 'react';
import type { WorkflowStage, Conversation } from '../types';
import ConversationCard from './ConversationCard';

interface WorkflowColumnProps {
  stage: WorkflowStage;
  conversations: Conversation[];
  onDrop: (conversationId: string, newStageId: string) => void;
}

const WorkflowColumn: React.FC<WorkflowColumnProps> = ({ stage, conversations, onDrop }) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const conversationId = e.dataTransfer.getData('conversationId');
    if (conversationId) {
      onDrop(conversationId, stage.id);
    }
  };

  const stageColors: { [key: string]: string } = {
    s1: 'bg-slate-400',
    s2: 'bg-blue-400',
    s3: 'bg-yellow-400',
    s4: 'bg-green-400',
    s5: 'bg-emerald-600',
    s6: 'bg-orange-400',
    s7: 'bg-red-400',
  };

  return (
    <div
      className="flex-shrink-0 w-80 bg-slate-100/70 backdrop-blur-sm rounded-2xl p-3 flex flex-col border border-slate-200 shadow-sm h-full max-h-full"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between mb-4 px-2 mt-1">
        <div className="flex items-center space-x-2">
           <span className={`w-2.5 h-2.5 rounded-full ${stageColors[stage.id] || 'bg-slate-400'}`}></span>
           <h3 className="font-bold text-slate-700 tracking-wide text-sm uppercase">{stage.title}</h3>
        </div>
        <span className="text-xs font-bold bg-white text-slate-600 rounded-md px-2 py-1 border border-slate-200 shadow-sm">
          {conversations.length}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {conversations.map(conv => (
          <ConversationCard key={conv.id} conversation={conv} />
        ))}
        {conversations.length === 0 && (
            <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium italic">
                Arraste um card aqui
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowColumn;
