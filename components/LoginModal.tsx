
import React, { useState, useEffect } from 'react';
import { User, LogIn, MessageCircle, Smartphone, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (userInfo?: any) => void;
  onCancel: () => void;
}

type Step = 'select' | 'phone' | 'otp';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, onCancel }) => {
  const [step, setStep] = useState<Step>('select');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setPhone('');
      setOtp(['', '', '', '']);
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleSendCode = () => {
    if (phone.length !== 11) {
      setError('请输入有效的11位手机号');
      return;
    }
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setCountdown(60);
      // Mock code sent
    }, 1500);
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) return;

    setIsLoading(true);
    
    // Simulate Verification
    setTimeout(() => {
      setIsLoading(false);
      // Success
      onLogin({ 
        name: `用户${phone.slice(-4)}`, 
        id: phone,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${phone}` 
      });
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent pasting multiple chars for now
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-submit on last digit
    if (index === 3 && value) {
        // Optional: trigger verify immediately
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // --- Views ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s]">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Header */}
        <div className="p-8 pb-0">
            {step !== 'select' && (
                <button 
                    onClick={() => setStep(step === 'otp' ? 'phone' : 'select')}
                    className="mb-4 p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            
            <div className={`transition-all duration-500 ${step === 'select' ? 'text-center' : 'text-left'}`}>
                {step === 'select' && (
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                        <User size={32} />
                    </div>
                )}
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {step === 'select' && '同步您的数据'}
                    {step === 'phone' && '手机号登录'}
                    {step === 'otp' && '输入验证码'}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {step === 'select' && '登录以将您的健康记录安全备份至云端，并在多设备间同步。'}
                    {step === 'phone' && '未注册的手机号验证后将自动创建账号。'}
                    {step === 'otp' && `验证码已发送至 +86 ${phone}`}
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
            
            {/* VIEW: SELECT */}
            {step === 'select' && (
                <div className="space-y-3 animate-[fadeIn_0.3s]">
                    <button 
                        onClick={() => onLogin({ name: '微信用户', id: 'wx_user', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=wx' })}
                        className="w-full bg-[#07c160] hover:bg-[#06ad56] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-100"
                    >
                        <MessageCircle size={20} fill="white" />
                        微信一键登录
                    </button>
                    
                    <button 
                        onClick={() => setStep('phone')}
                        className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all"
                    >
                        <Smartphone size={20} />
                        手机号登录
                    </button>

                    <div className="pt-4 text-center">
                        <button 
                            onClick={onCancel}
                            className="text-slate-400 text-sm hover:text-slate-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            暂不登录，继续试用
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW: PHONE INPUT */}
            {step === 'phone' && (
                <div className="animate-[slideLeft_0.3s]">
                     <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-center mb-6 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                        <span className="pl-4 pr-3 border-r border-slate-200 text-slate-500 font-bold text-lg">+86</span>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                setPhone(val);
                                setError('');
                            }}
                            className="flex-1 bg-transparent p-3 text-xl font-bold text-slate-800 outline-none placeholder-slate-300 w-full"
                            placeholder="请输入手机号"
                            autoFocus
                        />
                     </div>
                     
                     {error && <p className="text-red-500 text-xs mb-4 -mt-4 ml-1">{error}</p>}

                     <button 
                        onClick={handleSendCode}
                        disabled={isLoading || phone.length < 11}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                            phone.length === 11 && !isLoading
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-teal-200/50 active:scale-[0.98]' 
                            : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : '获取验证码'}
                    </button>
                </div>
            )}

            {/* VIEW: OTP INPUT */}
            {step === 'otp' && (
                <div className="animate-[slideLeft_0.3s]">
                    <div className="flex justify-between gap-3 mb-8">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text" 
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className={`w-14 h-16 rounded-2xl border-2 text-center text-2xl font-bold outline-none transition-all ${
                                    digit 
                                    ? 'border-teal-500 bg-teal-50/50 text-teal-700' 
                                    : 'border-slate-100 bg-slate-50 focus:border-teal-500 focus:bg-white'
                                }`}
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleVerify}
                        disabled={isLoading || otp.join('').length !== 4}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                            otp.join('').length === 4 && !isLoading
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-teal-200/50 active:scale-[0.98]' 
                            : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : '验证并登录'}
                    </button>

                    <div className="mt-6 text-center">
                        {countdown > 0 ? (
                            <span className="text-slate-400 text-sm font-medium">{countdown}秒后重新获取</span>
                        ) : (
                            <button 
                                onClick={handleSendCode}
                                className="text-teal-600 text-sm font-bold hover:text-teal-700"
                            >
                                重新发送验证码
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
