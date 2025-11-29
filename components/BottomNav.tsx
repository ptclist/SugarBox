import React from 'react';
import { Activity, Plus, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-white/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]"></div>
      
      <div className="relative flex items-center justify-between px-8 pb-8 pt-4 max-w-md mx-auto">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <Activity size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">血糖</span>
        </button>

        {/* Floating Action Button (FAB) */}
        <div className="relative -top-6">
          <button 
            onClick={onAddClick}
            className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full shadow-lg shadow-teal-200/60 flex items-center justify-center text-white transition-transform active:scale-95 hover:shadow-xl hover:-translate-y-1"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium tracking-wide">我的</span>
        </button>
      </div>
    </div>
  );
};