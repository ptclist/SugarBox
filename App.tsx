import React, { useState, useEffect } from 'react';
import { Settings, LogOut, ChevronRight, Droplet, Clock, User, PlusCircle } from 'lucide-react';
import { GlucoseChart } from './components/GlucoseChart';
import { RecordModal } from './components/RecordModal';
import { BottomNav } from './components/BottomNav';
import { PrivacyOverlay } from './components/PrivacyOverlay';
import { LoginModal } from './components/LoginModal';
import { AppState, GlucoseRecord, RecordType } from './types';
import { INITIAL_GLUCOSE_DATA } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<AppState>({
    privacyAccepted: false,
    user: null,
    glucoseRecords: [],
    bpRecords: [],
    medRecords: [],
    dietRecords: []
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<{type: RecordType, data: any} | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Initialize from local storage
    const storedPrivacy = localStorage.getItem('gluco_privacy');
    const storedUser = localStorage.getItem('gluco_user');
    const storedGlucose = localStorage.getItem('gluco_records');

    setState(prev => ({
      ...prev,
      privacyAccepted: storedPrivacy === 'true',
      user: storedUser ? JSON.parse(storedUser) : null,
      glucoseRecords: storedGlucose ? JSON.parse(storedGlucose) : INITIAL_GLUCOSE_DATA
    }));
  }, []);

  useEffect(() => {
    // Persist records when they change
    if (state.glucoseRecords.length > 0) {
        localStorage.setItem('gluco_records', JSON.stringify(state.glucoseRecords));
    }
  }, [state.glucoseRecords]);

  // --- Handlers ---
  const handlePrivacyAction = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem('gluco_privacy', 'true');
      setState(prev => ({ ...prev, privacyAccepted: true }));
    } else {
      // Simulate close
      window.close();
      alert("应用需要同意隐私协议才能继续。请关闭页面。");
    }
  };

  const handleRecordSubmit = (type: RecordType, data: any) => {
    const timestamp = Date.now();
    const id = Math.random().toString(36).substr(2, 9);
    
    // Check login status for "Strict" logging, but request implies trigger on submit
    if (!state.user) {
        setPendingRecord({ type, data: { ...data, id, timestamp } });
        setRecordModalOpen(false);
        setLoginModalOpen(true);
        return;
    }

    saveRecord(type, { ...data, id, timestamp });
    setRecordModalOpen(false);
  };

  const saveRecord = (type: RecordType, record: any) => {
    if (type === 'glucose') {
        setState(prev => ({
            ...prev,
            glucoseRecords: [record, ...prev.glucoseRecords]
        }));
    } else {
        // Handle other types appropriately (simplified for this demo)
        console.log(`Saved ${type} record:`, record);
    }
  };

  const handleLogin = () => {
    // Simulate WeChat Login
    const mockUser = { id: 'u1', name: '游客用户', avatar: 'https://picsum.photos/100' };
    localStorage.setItem('gluco_user', JSON.stringify(mockUser));
    setState(prev => ({ ...prev, user: mockUser }));
    setLoginModalOpen(false);
    
    // Resume pending action
    if (pendingRecord) {
        saveRecord(pendingRecord.type, pendingRecord.data);
        setPendingRecord(null);
    }
  };

  const handleGuestContinue = () => {
      setLoginModalOpen(false);
      // Allow saving in guest mode too
      if (pendingRecord) {
          saveRecord(pendingRecord.type, pendingRecord.data);
          setPendingRecord(null);
      }
  };

  const clearCache = () => {
      if(window.confirm("确定要清除所有本地数据吗？")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const getLatestGlucose = (): GlucoseRecord | undefined => {
      if (state.glucoseRecords.length === 0) return undefined;
      return state.glucoseRecords.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
  };

  const latest = getLatestGlucose();
  const getStatusColor = (val: number) => {
      if (val < 3.9) return 'text-orange-500';
      if (val > 7.8) return 'text-rose-500';
      return 'text-teal-600';
  };

  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return '早上好';
      if (hour < 18) return '下午好';
      return '晚上好';
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-800">
      {!state.privacyAccepted && (
        <PrivacyOverlay 
          onAccept={() => handlePrivacyAction(true)} 
          onDecline={() => handlePrivacyAction(false)} 
        />
      )}

      <RecordModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setRecordModalOpen(false)} 
        onSubmit={handleRecordSubmit} 
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onLogin={handleLogin} 
        onCancel={handleGuestContinue} 
      />

      {/* --- HOME VIEW --- */}
      {activeTab === 'home' && (
        <main className="p-6 max-w-md mx-auto animate-[fadeIn_0.5s]">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 pt-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}，</h1>
              <p className="text-slate-500 text-sm">{state.user ? state.user.name : '访客'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                {state.user?.avatar ? <img src={state.user.avatar} alt="Avatar" /> : <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500"><Settings size={16}/></div>}
            </div>
          </header>

          {/* Main Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-soft shadow-teal-500/10 relative overflow-hidden mb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-60"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold tracking-wide mb-2">
                  最新血糖
                </span>
                <div className="flex items-baseline gap-1">
                  <h2 className={`text-6xl font-bold tracking-tight ${latest ? getStatusColor(latest.value) : 'text-slate-300'}`}>
                    {latest ? latest.value.toFixed(1) : '--'}
                  </h2>
                  <span className="text-slate-400 font-medium">mmol/L</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                 <Droplet size={24} className={latest ? getStatusColor(latest.value) : 'text-slate-300'} fill="currentColor" fillOpacity={0.2} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between text-sm text-slate-500">
               <span className="flex items-center gap-1"><Clock size={14}/> {latest ? new Date(latest.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</span>
               <span className="capitalize">{latest ? (latest.type === 'fasting' ? '空腹' : '餐后') : '暂无数据'}</span>
            </div>
          </div>

          {/* Explicit Record Button (Requested feature) */}
          <button 
            onClick={() => setRecordModalOpen(true)}
            className="w-full bg-white border-2 border-dashed border-teal-200 text-teal-600 font-semibold py-3.5 rounded-2xl mb-6 hover:bg-teal-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            立即记录血糖
          </button>

          {/* Chart Section */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-700 mb-2 px-2">7日趋势</h3>
            <div className="bg-white rounded-2xl p-4 shadow-soft h-64">
                <GlucoseChart data={state.glucoseRecords} />
            </div>
          </div>
        </main>
      )}

      {/* --- PROFILE VIEW --- */}
      {activeTab === 'profile' && (
        <main className="p-6 max-w-md mx-auto animate-[fadeIn_0.5s]">
           <header className="mb-8 pt-4">
              <h1 className="text-2xl font-bold text-slate-800">个人中心</h1>
           </header>

           {!state.user && (
               <div 
                onClick={() => setLoginModalOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl p-6 text-white shadow-lg shadow-teal-200 mb-6 cursor-pointer transform transition hover:scale-[1.02]"
               >
                   <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                           <User size={32} />
                       </div>
                       <div>
                           <h3 className="font-bold text-lg">登录 / 注册</h3>
                           <p className="text-teal-50 text-sm">同步数据，永久保存</p>
                       </div>
                       <ChevronRight className="ml-auto opacity-70" />
                   </div>
               </div>
           )}

           {state.user && (
               <div className="bg-white rounded-2xl p-6 shadow-soft mb-6 flex items-center gap-4">
                    <img src={state.user.avatar} className="w-16 h-16 rounded-full" alt="User" />
                    <div>
                        <h3 className="font-bold text-lg">{state.user.name}</h3>
                        <p className="text-slate-400 text-sm">高级会员</p>
                    </div>
               </div>
           )}

           <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
               <div className="p-4 border-b border-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                   <span className="font-medium text-slate-700">导出健康数据</span>
                   <ChevronRight size={18} className="text-slate-300" />
               </div>
               <div className="p-4 border-b border-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                   <span className="font-medium text-slate-700">隐私协议</span>
                   <ChevronRight size={18} className="text-slate-300" />
               </div>
               <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                   <span className="font-medium text-slate-700">服务条款</span>
                   <ChevronRight size={18} className="text-slate-300" />
               </div>
           </div>

           <button 
             onClick={clearCache}
             className="mt-8 w-full py-4 rounded-xl border border-red-100 text-red-500 font-medium bg-white hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
           >
               <LogOut size={18} />
               清除本地缓存
           </button>
           
           <div className="mt-8 text-center">
               <p className="text-xs text-slate-400">GlucoGuard Pro v1.0.0</p>
               <div className="flex justify-center gap-4 mt-2">
                   <a href="#" className="text-[10px] text-slate-300 underline">法律条款</a>
                   <a href="#" className="text-[10px] text-slate-300 underline">隐私政策</a>
               </div>
           </div>
        </main>
      )}

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => setRecordModalOpen(true)} 
      />
    </div>
  );
};

export default App;