
import React, { useState, useEffect } from 'react';
import { 
  X, Check, ArrowLeft, 
  Droplet, HeartPulse, Pill, Utensils, 
  Weight, Ruler, Thermometer, Activity, 
  Dumbbell, Frown, Moon, GlassWater, 
  Footprints, Stethoscope, Wind, Smile, Meh
} from 'lucide-react';
import { RecordType } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: RecordType, data: any) => void;
  initialType?: RecordType;
}

// --- Icons Mapping ---
const ICONS: Record<RecordType, any> = {
  glucose: Droplet,
  bp: HeartPulse,
  medication: Pill,
  diet: Utensils,
  weight: Weight,
  height: Ruler,
  temperature: Thermometer,
  heartRate: Activity,
  exercise: Dumbbell,
  symptoms: Stethoscope,
  sleep: Moon,
  mood: Frown, // Default, will change in UI
  oxygen: Wind,
  steps: Footprints,
  hydration: GlassWater,
};

const CATEGORIES = [
  {
    title: '主要体征',
    items: [
      { type: 'glucose', label: '血糖', color: 'bg-teal-100 text-teal-600' },
      { type: 'bp', label: '血压', color: 'bg-rose-100 text-rose-600' },
      { type: 'heartRate', label: '心率', color: 'bg-red-100 text-red-600' },
      { type: 'oxygen', label: '血氧', color: 'bg-sky-100 text-sky-600' },
      { type: 'temperature', label: '体温', color: 'bg-orange-100 text-orange-600' },
    ]
  },
  {
    title: '身体数据',
    items: [
      { type: 'weight', label: '体重', color: 'bg-indigo-100 text-indigo-600' },
      { type: 'height', label: '身高', color: 'bg-blue-100 text-blue-600' },
    ]
  },
  {
    title: '生活方式',
    items: [
      { type: 'diet', label: '饮食', color: 'bg-green-100 text-green-600' },
      { type: 'exercise', label: '运动', color: 'bg-amber-100 text-amber-600' },
      { type: 'sleep', label: '睡眠', color: 'bg-purple-100 text-purple-600' },
      { type: 'mood', label: '心情', color: 'bg-pink-100 text-pink-600' },
      { type: 'hydration', label: '饮水', color: 'bg-cyan-100 text-cyan-600' },
      { type: 'steps', label: '步数', color: 'bg-lime-100 text-lime-600' },
    ]
  },
  {
    title: '医疗健康',
    items: [
      { type: 'medication', label: '用药', color: 'bg-emerald-100 text-emerald-600' },
      { type: 'symptoms', label: '症状', color: 'bg-gray-100 text-gray-600' },
    ]
  }
];

export const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSubmit, initialType }) => {
  const [view, setView] = useState<'grid' | 'form'>('grid');
  const [activeType, setActiveType] = useState<RecordType>('glucose');
  const [formData, setFormData] = useState<any>({});

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setActiveType(initialType);
        setView('form');
      } else {
        setView('grid');
      }
      setFormData({});
    }
  }, [isOpen, initialType]);

  const handleGridSelect = (type: RecordType) => {
    setActiveType(type);
    setView('form');
    setFormData({});
  };

  const handleBack = () => {
    if (initialType) {
      onClose(); // Close if we came directly here
    } else {
      setView('grid');
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const submitForm = () => {
    // Basic Validation
    if (activeType === 'glucose' && !formData.value) return;
    if (activeType === 'bp' && (!formData.systolic || !formData.diastolic)) return;
    
    // Add defaults based on type
    const finalData = { ...formData };
    
    // Type specific defaults logic
    if (activeType === 'glucose' && !finalData.unit) finalData.unit = 'mmol/L';
    if (activeType === 'glucose' && !finalData.context) finalData.context = 'fasting';
    if (activeType === 'bp' && !finalData.position) finalData.position = 'sitting';
    if (activeType === 'mood' && !finalData.scale) finalData.scale = 3;

    onSubmit(activeType, finalData);
  };

  if (!isOpen) return null;

  const ActiveIcon = ICONS[activeType] || Activity;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {view === 'form' && !initialType && (
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
                <ArrowLeft size={20} />
              </button>
            )}
            <h3 className="text-lg font-bold text-slate-800">
              {view === 'grid' ? '选择记录类型' : (
                <span className="flex items-center gap-2">
                   {CATEGORIES.flatMap(c => c.items).find(i => i.type === activeType)?.label}记录
                </span>
              )}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50">
          
          {/* VIEW: GRID */}
          {view === 'grid' && (
            <div className="space-y-6 pb-12 animate-[fadeIn_0.3s]">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">{cat.title}</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {cat.items.map((item) => {
                      const ItemIcon = ICONS[item.type as RecordType];
                      return (
                        <button 
                          key={item.type}
                          onClick={() => handleGridSelect(item.type as RecordType)}
                          className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all hover:shadow-md"
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                            <ItemIcon size={24} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW: FORM */}
          {view === 'form' && (
            <div className="pb-8 animate-[slideLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              {/* Dynamic Form Content */}
              <FormContent type={activeType} data={formData} onChange={updateField} />
            </div>
          )}
        </div>

        {/* Footer Action */}
        {view === 'form' && (
           <div className="p-4 bg-white border-t border-slate-100">
             <button 
                onClick={submitForm}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
                <Check size={20} />
                保存记录
            </button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-components for Forms ---

const BigNumberInput = ({ value, onChange, unit, placeholder = "0" }: any) => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="relative">
      <input 
        type="number" 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-48 text-center text-5xl font-bold text-slate-800 bg-transparent border-b-2 border-teal-200 focus:border-teal-500 focus:outline-none placeholder-slate-200 pb-2"
        autoFocus
      />
      {unit && <span className="absolute -right-8 bottom-4 text-slate-400 font-medium">{unit}</span>}
    </div>
  </div>
);

const TagSelector = ({ options, value, onChange }: any) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {options.map((opt: any) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
          value === opt.value 
          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const FormContent = ({ type, data, onChange }: { type: RecordType, data: any, onChange: (f: string, v: any) => void }) => {
  switch (type) {
    case 'glucose':
      return (
        <div className="space-y-8">
          <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="mmol/L" />
          <TagSelector 
            value={data.context || 'fasting'} 
            onChange={(v: any) => onChange('context', v)}
            options={[
              { label: '空腹', value: 'fasting' },
              { label: '早餐后', value: 'post-breakfast' },
              { label: '午餐后', value: 'post-lunch' },
              { label: '晚餐后', value: 'post-dinner' },
              { label: '睡前', value: 'bedtime' },
            ]} 
          />
        </div>
      );

    case 'bp':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <label className="text-xs text-slate-400 block mb-2">收缩压 (高压)</label>
                <input 
                  type="number" 
                  className="w-full text-3xl font-bold text-center text-slate-700 outline-none" 
                  placeholder="120"
                  value={data.systolic || ''}
                  onChange={(e) => onChange('systolic', parseInt(e.target.value))}
                />
             </div>
             <span className="text-2xl text-slate-300">/</span>
             <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <label className="text-xs text-slate-400 block mb-2">舒张压 (低压)</label>
                <input 
                  type="number" 
                  className="w-full text-3xl font-bold text-center text-slate-700 outline-none" 
                  placeholder="80"
                  value={data.diastolic || ''}
                  onChange={(e) => onChange('diastolic', parseInt(e.target.value))}
                />
             </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Activity size={18} /> 心率 (次/分)
            </label>
            <input 
               type="number" 
               className="w-24 text-right text-xl font-bold text-slate-700 outline-none" 
               placeholder="75"
               value={data.pulse || ''}
               onChange={(e) => onChange('pulse', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-3">
             <label className="text-sm text-slate-400 ml-1">测量体位</label>
             <TagSelector 
                value={data.position || 'sitting'} 
                onChange={(v: any) => onChange('position', v)}
                options={[
                  { label: '坐姿', value: 'sitting' },
                  { label: '卧姿', value: 'lying' },
                  { label: '站姿', value: 'standing' },
                ]} 
             />
          </div>
        </div>
      );

    case 'weight':
      return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="kg" />;
      
    case 'temperature':
      return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="°C" />;
      
    case 'heartRate':
      return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="bpm" />;
      
    case 'oxygen':
        return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="%" />;

    case 'steps':
        return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="步" placeholder="0" />;

    case 'hydration':
        return <BigNumberInput value={data.value} onChange={(v: any) => onChange('value', parseFloat(v))} unit="ml" placeholder="250" />;

    case 'medication':
        return (
            <div className="space-y-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <label className="text-xs text-slate-400 block mb-1">药品名称</label>
                    <input type="text" className="w-full text-lg font-bold text-slate-700 outline-none placeholder-slate-300" placeholder="例如：二甲双胍" value={data.name || ''} onChange={e => onChange('name', e.target.value)} />
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <label className="text-xs text-slate-400 block mb-1">剂量</label>
                    <input type="text" className="w-full text-lg font-bold text-slate-700 outline-none placeholder-slate-300" placeholder="例如：0.5g" value={data.dosage || ''} onChange={e => onChange('dosage', e.target.value)} />
                 </div>
            </div>
        );

    case 'diet':
        return (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <label className="text-xs text-slate-400 block mb-1">食物内容</label>
                    <textarea rows={3} className="w-full text-lg text-slate-700 outline-none placeholder-slate-300 resize-none" placeholder="记录你吃了什么..." value={data.food || ''} onChange={e => onChange('food', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <label className="text-xs text-slate-400 ml-1">餐别</label>
                    <TagSelector 
                        value={data.mealType || 'breakfast'} 
                        onChange={(v: any) => onChange('mealType', v)}
                        options={[
                        { label: '早餐', value: 'breakfast' },
                        { label: '午餐', value: 'lunch' },
                        { label: '晚餐', value: 'dinner' },
                        { label: '加餐', value: 'snack' },
                        ]} 
                    />
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-600">预估热量 (kcal)</label>
                    <input type="number" className="w-24 text-right text-lg font-bold text-slate-700 outline-none" placeholder="0" value={data.calories || ''} onChange={e => onChange('calories', parseFloat(e.target.value))} />
                 </div>
            </div>
        );
    
    case 'mood':
        return (
            <div className="space-y-8 py-4">
                <div className="flex justify-between px-4">
                    {[1, 2, 3, 4, 5].map((level) => {
                        const isSelected = (data.scale || 3) === level;
                        const Icons = [Frown, Frown, Meh, Smile, Smile];
                        const CurrentIcon = Icons[level - 1];
                        const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];
                        
                        return (
                            <button 
                                key={level}
                                onClick={() => onChange('scale', level)}
                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${isSelected ? 'scale-125' : 'opacity-40 scale-100'}`}
                            >
                                <CurrentIcon size={48} className={isSelected ? colors[level-1] : 'text-slate-400'} fill={isSelected ? 'currentColor' : 'none'} fillOpacity={0.2} />
                                <span className="text-xs font-bold text-slate-400">{level}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <textarea rows={3} className="w-full text-base text-slate-700 outline-none placeholder-slate-300 resize-none" placeholder="写点什么记录此刻的心情..." value={data.note || ''} onChange={e => onChange('note', e.target.value)} />
                </div>
            </div>
        );

    case 'sleep':
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-end px-2">
                        <label className="text-sm font-medium text-slate-600">睡眠时长</label>
                        <span className="text-2xl font-bold text-teal-600">{data.duration || 8} <span className="text-sm text-slate-400 font-normal">小时</span></span>
                    </div>
                    <input 
                        type="range" min="0" max="24" step="0.5" 
                        value={data.duration || 8} 
                        onChange={e => onChange('duration', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs text-slate-400 ml-1">睡眠质量</label>
                    <TagSelector 
                        value={data.quality || 'good'} 
                        onChange={(v: any) => onChange('quality', v)}
                        options={[
                        { label: '糟糕', value: 'poor' },
                        { label: '一般', value: 'fair' },
                        { label: '良好', value: 'good' },
                        { label: '极佳', value: 'excellent' },
                        ]} 
                    />
                </div>
            </div>
        );

    default:
        return (
            <div className="p-8 text-center text-slate-400">
                <p>该类型的详细记录表单正在开发中...</p>
                <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                     <label className="text-xs text-slate-400 block mb-1">备注信息</label>
                     <textarea rows={3} className="w-full text-base text-slate-700 outline-none placeholder-slate-300 resize-none" placeholder="记录相关信息..." value={data.note || ''} onChange={e => onChange('note', e.target.value)} />
                </div>
            </div>
        );
  }
};
