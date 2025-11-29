import React, { useState } from 'react';
import { X, Droplet, HeartPulse, Pill, Utensils, Check } from 'lucide-react';
import { RecordType } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: RecordType, data: any) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeType, setActiveType] = useState<RecordType>('glucose');
  
  // Form States
  const [glucose, setGlucose] = useState<string>('');
  const [glucoseType, setGlucoseType] = useState<'fasting' | 'post-meal'>('fasting');
  
  const [bpSys, setBpSys] = useState<string>('');
  const [bpDia, setBpDia] = useState<string>('');
  const [bpPos, setBpPos] = useState<'sitting' | 'lying'>('sitting');
  
  const [medName, setMedName] = useState<string>('');
  const [medDosage, setMedDosage] = useState<string>('');
  
  const [dietFood, setDietFood] = useState<string>('');
  const [dietMeal, setDietMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  if (!isOpen) return null;

  const handleSubmit = () => {
    let data: any = {};
    if (activeType === 'glucose') {
        if (!glucose) return;
        data = { value: parseFloat(glucose), type: glucoseType };
    } else if (activeType === 'bp') {
        if (!bpSys || !bpDia) return;
        data = { systolic: parseInt(bpSys), diastolic: parseInt(bpDia), position: bpPos };
    } else if (activeType === 'medication') {
        if (!medName) return;
        data = { name: medName, dosage: medDosage };
    } else if (activeType === 'diet') {
        if (!dietFood) return;
        data = { food: dietFood, mealType: dietMeal };
    }
    onSubmit(activeType, data);
    
    // Reset fields
    setGlucose(''); setBpSys(''); setBpDia(''); setMedName(''); setMedDosage(''); setDietFood('');
  };

  const TabButton = ({ type, icon: Icon, label }: { type: RecordType, icon: any, label: string }) => (
    <button
      onClick={() => setActiveType(type)}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
        activeType === type ? 'text-teal-600 bg-teal-50 ring-2 ring-teal-100' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} strokeWidth={activeType === type ? 2.5 : 2} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center bg-slate-900/50 backdrop-blur-[2px]">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">新增记录</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2 p-4 pb-2">
            <TabButton type="glucose" icon={Droplet} label="血糖" />
            <TabButton type="bp" icon={HeartPulse} label="血压" />
            <TabButton type="medication" icon={Pill} label="用药" />
            <TabButton type="diet" icon={Utensils} label="饮食" />
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2">
            {activeType === 'glucose' && (
                <div className="space-y-4 animate-[fadeIn_0.3s]">
                    <div className="flex items-center justify-center mb-6">
                         <div className="relative">
                            <input 
                                type="number" 
                                value={glucose}
                                onChange={(e) => setGlucose(e.target.value)}
                                placeholder="0.0" 
                                className="w-32 text-center text-4xl font-bold text-teal-700 border-b-2 border-teal-200 focus:border-teal-500 focus:outline-none placeholder-slate-200 bg-transparent p-2"
                                autoFocus
                            />
                            <span className="absolute right-[-2rem] bottom-4 text-slate-400 text-sm">mmol/L</span>
                         </div>
                    </div>
                    <div className="flex gap-3">
                        {['fasting', 'post-meal'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setGlucoseType(t as any)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                                    glucoseType === t 
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {t === 'fasting' ? '空腹' : '餐后'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeType === 'bp' && (
                 <div className="space-y-4 animate-[fadeIn_0.3s]">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-1 block">收缩压 (高压)</label>
                            <input type="number" value={bpSys} onChange={e => setBpSys(e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 text-lg font-semibold text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none" placeholder="120" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-1 block">舒张压 (低压)</label>
                            <input type="number" value={bpDia} onChange={e => setBpDia(e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 text-lg font-semibold text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none" placeholder="80" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['sitting', 'lying'].map((pos) => (
                             <button key={pos} onClick={() => setBpPos(pos as any)} className={`flex-1 py-2 rounded-lg text-sm ${bpPos === pos ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-500'}`}>{pos === 'sitting' ? '坐姿' : '卧姿'}</button>
                        ))}
                    </div>
                 </div>
            )}

            {activeType === 'medication' && (
                <div className="space-y-4 animate-[fadeIn_0.3s]">
                    <input type="text" value={medName} onChange={e => setMedName(e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 font-medium text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none" placeholder="药品名称 (如: 二甲双胍)" />
                    <input type="text" value={medDosage} onChange={e => setMedDosage(e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 font-medium text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none" placeholder="剂量 (如: 0.5g)" />
                </div>
            )}

            {activeType === 'diet' && (
                <div className="space-y-4 animate-[fadeIn_0.3s]">
                    <input type="text" value={dietFood} onChange={e => setDietFood(e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 font-medium text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none" placeholder="吃了什么？" />
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((m) => {
                            const labels: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };
                            return (
                                <button key={m} onClick={() => setDietMeal(m as any)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${dietMeal === m ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {labels[m]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <button 
                onClick={handleSubmit}
                className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
                <Check size={20} />
                保存记录
            </button>
        </div>
      </div>
    </div>
  );
};