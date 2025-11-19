
import React, { useState } from 'react';
import type { View } from '../types';
import { PlatformIcon } from './icons/PlatformIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseButtonClass = "px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp-500 w-full md:w-auto text-left md:text-center";
  const activeButtonClass = "bg-whatsapp-600 text-white";
  const inactiveButtonClass = "bg-white text-slate-700 hover:bg-slate-50";

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md z-20 relative">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Logo Container - Clean Tech Style */}
          <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-200 flex items-center justify-center group hover:scale-105 transition-transform duration-300">
            <PlatformIcon className="w-6 h-6 text-whatsapp-400 group-hover:text-whatsapp-300 transition-colors" />
          </div>
          <div>
             <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Allzap</h1>
             <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Manager</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`${baseButtonClass} ${currentView === 'dashboard' ? activeButtonClass : inactiveButtonClass}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className={`${baseButtonClass} ${currentView === 'workflow' ? activeButtonClass : inactiveButtonClass}`}
          >
            Workflow
          </button>
          <button
            onClick={() => handleNavClick('reports')}
            className={`${baseButtonClass} ${currentView === 'reports' ? activeButtonClass : inactiveButtonClass}`}
          >
            Relatórios
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
             <XMarkIcon className="w-6 h-6" />
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
             </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg p-4 flex flex-col space-y-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`${baseButtonClass} ${currentView === 'dashboard' ? activeButtonClass : 'bg-slate-50 text-slate-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className={`${baseButtonClass} ${currentView === 'workflow' ? activeButtonClass : 'bg-slate-50 text-slate-700'}`}
          >
            Workflow
          </button>
          <button
            onClick={() => handleNavClick('reports')}
            className={`${baseButtonClass} ${currentView === 'reports' ? activeButtonClass : 'bg-slate-50 text-slate-700'}`}
          >
            Relatórios
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
