
import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

type TimeRange = 'daily' | '7days' | '15days' | 'monthly';

interface ReportStats {
  totalConversations: number;
  newLeads: number;
  conversionRate: number;
  lostRate: number;
  activeChats: number;
  avgResponseTime: string;
}

// Componente Gráfico de Barras Simples (Horários de Pico)
const BarChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end justify-between h-40 space-x-1.5">
      {data.map((value, index) => (
        <div key={index} className="flex flex-col items-center w-full group relative">
          <div 
            className="w-full bg-whatsapp-400 rounded-t-md hover:bg-whatsapp-600 transition-all duration-300 shadow-sm"
            style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }}
          ></div>
          <span className="text-[10px] text-slate-400 mt-1.5 font-medium">{index}h</span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 shadow-xl z-10 whitespace-nowrap font-semibold animate-fade-in">
             {value} msgs
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente Gráfico de Linha Simples (Novos Clientes)
const LineChart = ({ data }: { data: number[] }) => {
    // Normalizar dados para SVG
    const max = Math.max(...data) || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val / max) * 100);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-48 w-full relative overflow-hidden">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                 <defs>
                    <linearGradient id="gradientFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                    </linearGradient>
                 </defs>

                 {/* Grid lines */}
                 <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                 <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                 <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2" />
                 
                 {/* Area fill */}
                 <polygon points={`0,100 ${points} 100,100`} fill="url(#gradientFill)" />
                 {/* The Line */}
                 <polyline points={points} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                 
                 {/* Dots */}
                 {data.map((val, i) => {
                     const x = (i / (data.length - 1)) * 100;
                     const y = 100 - ((val / max) * 100);
                     return (
                         <circle key={i} cx={x} cy={y} r="1.5" className="fill-white stroke-whatsapp-600 stroke-2 hover:r-4 transition-all cursor-pointer">
                            <title>{val} clientes</title>
                         </circle>
                     )
                 })}
            </svg>
        </div>
    )
}

const ReportsBoard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [stats, setStats] = useState<ReportStats>({
    totalConversations: 0,
    newLeads: 0,
    conversionRate: 0,
    lostRate: 0,
    activeChats: 0,
    avgResponseTime: '0min'
  });
  const [peakHours, setPeakHours] = useState<number[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  // Simula a busca de dados baseada no filtro
  useEffect(() => {
    // Função para gerar números aleatórios baseados no range
    const generateStats = () => {
        let multiplier = 1;
        if (timeRange === 'daily') multiplier = 0.05;
        if (timeRange === '7days') multiplier = 0.25;
        if (timeRange === '15days') multiplier = 0.5;
        
        const baseTotal = Math.floor(1200 * multiplier) + 50;
        const baseLeads = Math.floor(baseTotal * 0.4);
        const converted = Math.floor(baseLeads * 0.35);
        const lost = Math.floor(baseLeads * 0.2);
        
        setStats({
            totalConversations: baseTotal,
            newLeads: baseLeads,
            conversionRate: 35, // fixo para demo
            lostRate: 20,
            activeChats: baseTotal - (converted + lost),
            avgResponseTime: timeRange === 'daily' ? '2min' : '15min'
        });

        // Gerar dados do gráfico de barras (24h)
        const hours = Array.from({ length: 24 }, (_, i) => {
            // Simula pico as 10h e as 15h
            if ((i >= 9 && i <= 11) || (i >= 14 && i <= 16)) return Math.floor(Math.random() * 50) + 50;
            if (i < 8 || i > 20) return Math.floor(Math.random() * 10);
            return Math.floor(Math.random() * 30) + 20;
        });
        setPeakHours(hours);

        // Gerar dados de tendência
        const points = timeRange === 'daily' ? 12 : (timeRange === '7days' ? 7 : (timeRange === '15days' ? 15 : 12));
        const trend = Array.from({ length: points }, () => Math.floor(Math.random() * 20) + 5);
        setTrendData(trend);
    };

    generateStats();
  }, [timeRange]);

  const handleExportPDF = () => {
    // Salva o título original
    const originalTitle = document.title;
    // Define um nome amigável para o arquivo
    const dateStr = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    document.title = `Relatorio_Allzap_${timeRange}_${dateStr}`;
    
    // Chama a impressão do navegador
    window.print();
    
    // Restaura o título
    document.title = originalTitle;
  };

  const filterButtonClass = (range: TimeRange) => 
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      timeRange === range 
        ? 'bg-whatsapp-600 text-white shadow-md ring-2 ring-whatsapp-600 ring-offset-2' 
        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
    }`;

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-slate-50 space-y-8">
      {/* Header com Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print-break-inside-avoid">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Relatórios Gerenciais</h2>
            <p className="text-slate-500 text-sm mt-1">Acompanhe a performance do seu atendimento e vendas.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-0 no-print">
            <div className="flex space-x-2 bg-slate-50 p-1.5 rounded-xl">
                <button onClick={() => setTimeRange('daily')} className={filterButtonClass('daily')}>Hoje</button>
                <button onClick={() => setTimeRange('7days')} className={filterButtonClass('7days')}>7 Dias</button>
                <button onClick={() => setTimeRange('15days')} className={filterButtonClass('15days')}>15 Dias</button>
                <button onClick={() => setTimeRange('monthly')} className={filterButtonClass('monthly')}>Mensal</button>
            </div>
            
            <button 
                onClick={handleExportPDF}
                className="flex items-center px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-300 transition-all active:scale-95"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Exportar PDF
            </button>
        </div>
      </div>

      {/* Cards de KPIs Modernizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print-break-inside-avoid">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-500"><path d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.875 7a3.875 3.875 0 0 1 7.75 0H4.75Zm8.438-5.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25ZM16.125 13a1.875 1.875 0 1 1 0-3.75 1.875 1.875 0 0 1 0 3.75Zm-4.688 0a3.375 3.375 0 0 1 6.563 0h-6.563Z" /></svg>
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total de Conversas</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalConversations}</h3>
            <div className="mt-3 flex items-center">
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    12%
                </span>
                <span className="text-xs text-slate-400 ml-2">vs período anterior</span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-purple-500"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>
             </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Novos Leads</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.newLeads}</h3>
            <div className="mt-3 flex items-center">
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    5%
                </span>
                <span className="text-xs text-slate-400 ml-2">vs período anterior</span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-whatsapp-500"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Conversão</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.conversionRate}%</h3>
            <p className="text-xs text-slate-400 mt-3 font-medium">Taxa de Vendas / Leads</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-red-400"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Churn Rate</p>
            <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.lostRate}%</h3>
            <p className="text-xs text-slate-400 mt-3 font-medium">Orçamentos Perdidos</p>
         </div>
      </div>

      {/* Linha do Meio: Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print-break-inside-avoid">
        {/* Gráfico de Distribuição (Funil) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição de Resultados</h3>
            <div className="flex-1 flex items-center justify-center my-4">
                <div className="relative w-56 h-56 rounded-full shadow-inner" style={{ background: `conic-gradient(#22c55e 0% 35%, #ef4444 35% 55%, #f1f5f9 55% 100%)` }}>
                    <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-slate-800 tracking-tighter">100%</span>
                        <span className="text-xs text-slate-400 font-bold uppercase mt-1">dos Leads</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-sm"></span><span className="text-sm font-medium text-slate-600">Convertidos (Vendas)</span></div>
                    <span className="font-bold text-slate-800">35%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-3 shadow-sm"></span><span className="text-sm font-medium text-slate-600">Perdidos</span></div>
                    <span className="font-bold text-slate-800">20%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-200 rounded-full mr-3 shadow-sm"></span><span className="text-sm font-medium text-slate-600">Em Negociação</span></div>
                    <span className="font-bold text-slate-800">45%</span>
                </div>
            </div>
        </div>

        {/* Gráfico de Crescimento (Linha) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Tendência de Novos Contatos</h3>
                    <p className="text-sm text-slate-500">Evolução da aquisição de leads no período selecionado.</p>
                </div>
                <span className="text-xs font-bold text-whatsapp-700 bg-whatsapp-50 border border-whatsapp-100 px-3 py-1 rounded-full">{timeRange === 'daily' ? 'VISÃO HORÁRIA' : 'VISÃO DIÁRIA'}</span>
             </div>
             <div className="flex-1 flex items-center w-full px-2">
                <LineChart data={trendData} />
             </div>
             <div className="flex justify-between mt-6 text-xs font-medium text-slate-400 px-2 border-t border-slate-50 pt-4">
                 <span>Início do Período</span>
                 <span>Meio do Período</span>
                 <span>Fim do Período</span>
             </div>
        </div>
      </div>

      {/* Linha Inferior: Horários de Pico */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print-break-inside-avoid">
         <div className="flex justify-between items-end mb-6">
             <div>
                <h3 className="text-lg font-bold text-slate-800">Horários de Pico</h3>
                <p className="text-sm text-slate-500">Volume médio de mensagens recebidas por hora.</p>
             </div>
         </div>
         <BarChart data={peakHours} />
         <div className="flex justify-between mt-3 text-xs font-medium text-slate-400 border-t border-slate-100 pt-2">
             <span>00:00</span>
             <span>06:00</span>
             <span>12:00</span>
             <span>18:00</span>
             <span>23:59</span>
         </div>
      </div>
    </div>
  );
};

export default ReportsBoard;
