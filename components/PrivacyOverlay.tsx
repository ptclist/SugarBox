import React from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';
import { PRIVACY_TEXT } from '../constants';

interface PrivacyOverlayProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyOverlay: React.FC<PrivacyOverlayProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 p-6 text-white text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wide">隐私与安全</h2>
        </div>
        
        <div className="p-6">
          <div 
            className="h-64 overflow-y-auto text-sm text-slate-600 leading-relaxed mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-200"
            dangerouslySetInnerHTML={{ __html: PRIVACY_TEXT }}
          />
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onAccept}
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-teal-200 transition-all duration-200"
            >
              同意并继续
            </button>
            <button 
              onClick={onDecline}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-medium py-3.5 rounded-xl transition-colors duration-200"
            >
              拒绝并退出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};