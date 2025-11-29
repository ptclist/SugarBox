import React from 'react';
import { User, LogIn, MessageCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: () => void;
  onCancel: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s]">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">同步您的数据</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          登录以将您的健康记录安全备份至云端，并在多设备间同步。
        </p>

        <button 
          onClick={onLogin}
          className="w-full bg-[#07c160] hover:bg-[#06ad56] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors mb-3 shadow-lg shadow-green-100"
        >
          <MessageCircle size={20} fill="white" />
          微信一键登录
        </button>
        
        <button 
          onClick={onCancel}
          className="text-slate-400 text-sm hover:text-slate-600 font-medium py-2"
        >
          暂不登录，继续试用
        </button>
      </div>
    </div>
  );
};