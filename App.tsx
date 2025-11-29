
import React, { useState, useEffect } from 'react';
import { Settings, LogOut, ChevronRight, Droplet, Clock, User as UserIcon, PlusCircle, ArrowRight } from 'lucide-react';
import { GlucoseChart } from './components/GlucoseChart';
import { RecordModal } from './components/RecordModal';
import { BottomNav } from './components/BottomNav';
import { PrivacyOverlay } from './components/PrivacyOverlay';
import { LoginModal } from './components/LoginModal';
import { Timeline } from './components/Timeline';
import { AppState, BaseRecord, RecordType, GlucoseRecord } from './types';
import { INITIAL_RECORDS } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<AppState>({
    privacyAccepted: false,
    user: null,
    records: [],
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [initialRecordType, setInitialRecordType] = useState<RecordType | undefined>(undefined);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<{type: RecordType, data: any} | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Initialize from local storage
    const storedPrivacy = localStorage.getItem('gluco_privacy');
    const storedUser = localStorage.getItem('gluco_user');
    const storedRecords = localStorage.getItem('gluco_records_v2');

    let initialRecords: BaseRecord[] = [];
    if (storedRecords) {
        initialRecords = JSON.parse(storedRecords);
    } else {
        // Use the new mixed mock data for a better first impression
        initialRecords = INITIAL_RECORDS;
    }

    setState(prev => ({
      ...prev,
      privacyAccepted: storedPrivacy === 'true',
      user: storedUser ? JSON.parse(storedUser) : null,
      records: initialRecords
    }));
  }, []);

  useEffect(() => {
    if (state.records.length > 0) {
        localStorage.setItem('gluco_records_v2', JSON.stringify(state.records));
    }
  }, [state.records]);

  // --- Handlers ---
  const handlePrivacyAction = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem('gluco_privacy', 'true');
      setState(prev => ({ ...prev, privacyAccepted: true }));
    } else {
      window.close();
      alert("应用需要同意隐私协议才能继续。请关闭页面。");
    }
  };

  // Open modal with specific type (e.g. from Home button) or undefined (from FAB for grid)
  const openRecordModal = (type?: RecordType) => {
      setInitialRecordType(type);
      setRecordModalOpen(true);
  };

  const handleRecordSubmit = (type: RecordType, data: any) => {
    const timestamp = Date.now();
    const id = Math.random().toString(36).substr(2, 9);
    
    // Check login for critical actions if desired, or just save locally
    if (!state.user && state.records.length > 20 && !localStorage.getItem('gluco_login_prompted')) {
        localStorage.setItem('gluco_login_prompted', 'true');
        setPendingRecord({ type, data: { ...data, id, timestamp, type } });
        setRecordModalOpen(false);
        setLoginModalOpen(true);
        return;
    }

    saveRecord({ ...data, id, timestamp, type });
    setRecordModalOpen(false);
  };

  const saveRecord = (record: BaseRecord) => {
    setState(prev => ({
        ...prev,
        records: [record, ...prev.records]
    }));
  };

  const handleLogin = (userInfo?: any) => {
    const user = userInfo || { id: 'u1', name: '微信用户', avatar: 'https://picsum.photos/100' };
    localStorage.setItem('gluco_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
    setLoginModalOpen(false);
    
    if (pendingRecord) {
        saveRecord(pendingRecord.data);
        setPendingRecord(null);
    }
  };

  const handleGuestContinue = () => {
      setLoginModalOpen(false);
      if (pendingRecord) {
          saveRecord(pendingRecord.data);
          setPendingRecord(null);
      }
  };

  const clearCache = () => {
      if(window.confirm("确定要清除所有本地数据吗？此操作无法撤销。")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  // --- Render Helpers ---
  const glucoseRecords = state.records.filter(r => r.type === 'glucose') as GlucoseRecord[];
  const latestGlucose = glucoseRecords.length > 0 
    ? glucoseRecords.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current) 
    : undefined;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return '早上好';
    if (hour < 13) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getGlucoseStatusColor = (val: number) => {
    if (val < 3.9) return 'text-red-500';
    if (val > 11.1) return 'text-orange-500';
    return 'text-teal-600';
  };

  const getGlucoseStatusText = (val: number) => {
    if (val < 3.9) return '偏低';
    if (val > 11.1) return '偏高';
    return '正常';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-800">
      {!state.privacyAccepted && (
        <PrivacyOverlay 
          onAccept={() => handlePrivacyAction(true)} 
          onDecline={() => handlePrivacyAction(false)} 
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onLogin={handleLogin} 
        onCancel={handleGuestContinue} 
      />

      <RecordModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setRecordModalOpen(false)} 
        onSubmit={handleRecordSubmit}
        initialType={initialRecordType}
      />

      {/* --- Page: Home --- */}
      {activeTab === 'home' && (
        <div className="p-6 pt-12 animate-[fadeIn_0.5s]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{getGreeting()}，{state.user ? state.user.name : '访客'}</h1>
              <p className="text-slate-400 text-sm mt-1">今天感觉怎么样？</p>
            </div>
            <div 
                onClick={() => !state.user && setLoginModalOpen(true)}
                className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer"
            >
                {state.user?.avatar ? (
                    <img src={state.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <UserIcon size={20} />
                    </div>
                )}
            </div>
          </div>

          {/* Main Card: Latest Glucose */}
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-soft p-6 mb-6 transition-all active:scale-[0.99]">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Droplet size={120} className="text-teal-500 transform rotate-12" />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wide">
                        最新血糖
                    </span>
                    <span className="text-slate-400 text-xs">
                        {latestGlucose 
                            ? new Date(latestGlucose.timestamp).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'}) 
                            : '--:--'}
                    </span>
                </div>

                <div className="flex items-end gap-3 mt-4 mb-6">
                    <span className={`text-6xl font-bold tracking-tighter ${latestGlucose ? getGlucoseStatusColor(latestGlucose.value) : 'text-slate-300'}`}>
                        {latestGlucose ? latestGlucose.value.toFixed(1) : '--'}
                    </span>
                    <span className="text-slate-400 text-lg font-medium mb-2">mmol/L</span>
                </div>

                {latestGlucose && (
                     <div className="flex items-center gap-2 mb-6">
                        <div className={`w-2.5 h-2.5 rounded-full ${latestGlucose.value > 11.1 ? 'bg-orange-500' : latestGlucose.value < 3.9 ? 'bg-red-500' : 'bg-teal-500'}`}></div>
                        <span className="text-sm font-medium text-slate-600">
                            {getGlucoseStatusText(latestGlucose.value)}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                            {latestGlucose.context === 'fasting' ? '空腹' : '餐后'}
                        </span>
                     </div>
                )}
                
                {/* Primary Action: Record Glucose */}
                <button 
                    onClick={() => openRecordModal('glucose')}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl text-white font-semibold shadow-lg shadow-teal-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                    <PlusCircle size={20} />
                    立即记录血糖
                </button>
             </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-3xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800">7天趋势</h3>
                <button className="text-teal-600 text-xs font-semibold flex items-center gap-1">
                    详情 <ChevronRight size={14} />
                </button>
            </div>
            <GlucoseChart data={glucoseRecords} />
          </div>

          {/* Timeline Section */}
          <Timeline records={state.records} />
        </div>
      )}

      {/* --- Page: Profile --- */}
      {activeTab === 'profile' && (
        <div className="p-6 pt-12 animate-[fadeIn_0.5s]">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">个人中心</h1>
            
            {!state.user ? (
                <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-teal-200 mb-8">
                    <h2 className="text-xl font-bold mb-2">登录同步数据</h2>
                    <p className="text-teal-50 text-sm mb-6 opacity-90">开启云端同步，更换设备数据不丢失，享受更多健康分析。</p>
                    <button 
                        onClick={() => setLoginModalOpen(true)}
                        className="bg-white text-teal-600 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform"
                    >
                        立即登录
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-6 shadow-soft mb-8 flex items-center gap-4">
                    <img src={state.user.avatar} alt="avatar" className="w-16 h-16 rounded-full bg-slate-100 object-cover" />
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{state.user.name}</h2>
                        <p className="text-xs text-slate-400">ID: {state.user.id}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Settings size={18} /></div>
                        <span className="text-slate-700 font-medium">设置</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                </div>
                {state.user && (
                    <div 
                        onClick={() => {
                            if(window.confirm('确定要退出登录吗？')) {
                                setState(s => ({...s, user: null}));
                                localStorage.removeItem('gluco_user');
                            }
                        }}
                        className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><LogOut size={18} /></div>
                            <span className="text-slate-700 font-medium">退出登录</span>
                        </div>
                    </div>
                )}
                <div 
                    onClick={clearCache}
                    className="p-4 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors"><LogOut size={18} /></div>
                        <span className="text-slate-700 font-medium group-hover:text-red-600">清除本地缓存</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-xs text-slate-300 mb-2">GlucoGuard Pro v1.0.0</p>
                <a href="#" className="text-xs text-slate-400 hover:text-teal-600 underline">隐私政策</a>
                <span className="text-slate-300 mx-2">|</span>
                <a href="#" className="text-xs text-slate-400 hover:text-teal-600 underline">用户协议</a>
            </div>
        </div>
      )}

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => openRecordModal()} 
      />
    </div>
  );
};

export default App;
