
import React from 'react';
import { 
  Droplet, HeartPulse, Pill, Utensils, Weight, Ruler, 
  Thermometer, Activity, Dumbbell, Stethoscope, Moon, 
  Frown, Wind, Footprints, GlassWater, Clock, ChevronRight
} from 'lucide-react';
import { BaseRecord, RecordType } from '../types';

interface TimelineProps {
  records: BaseRecord[];
}

// --- Configuration ---

const ICONS: Record<string, any> = {
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
  mood: Frown,
  oxygen: Wind,
  steps: Footprints,
  hydration: GlassWater,
};

// Colors for the timeline dots/accents
const TYPE_COLORS: Record<string, string> = {
  glucose: 'text-teal-500 bg-teal-50 border-teal-200',
  bp: 'text-rose-500 bg-rose-50 border-rose-200',
  medication: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  diet: 'text-orange-500 bg-orange-50 border-orange-200',
  weight: 'text-indigo-500 bg-indigo-50 border-indigo-200',
  sleep: 'text-purple-500 bg-purple-50 border-purple-200',
  exercise: 'text-blue-500 bg-blue-50 border-blue-200',
  default: 'text-slate-500 bg-slate-50 border-slate-200',
};

// --- Helper Functions ---

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

const getContextLabel = (context: string) => {
  const map: Record<string, string> = {
    fasting: '空腹', 'post-meal': '餐后', 'pre-meal': '餐前',
    bedtime: '睡前', 'post-breakfast': '早餐后', 'post-lunch': '午餐后', 'post-dinner': '晚餐后',
    sitting: '坐姿', lying: '卧姿', standing: '站姿',
    breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐',
    good: '良好', poor: '较差', fair: '一般', excellent: '极佳'
  };
  return map[context] || context;
};

// --- Specific Card Components ---

const GlucoseCard = ({ record }: { record: any }) => {
  const isHigh = record.value > 11.1;
  const isLow = record.value < 3.9;
  const valueColor = isHigh ? 'text-orange-500' : isLow ? 'text-red-500' : 'text-slate-800';
  
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-bold tracking-tight ${valueColor}`}>{record.value}</span>
        <span className="text-xs text-slate-400 font-medium">{record.unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isHigh || isLow ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}>
          {isHigh ? '偏高' : isLow ? '偏低' : '正常'}
        </span>
        <span className="text-xs text-slate-400">{getContextLabel(record.context)}</span>
      </div>
    </div>
  );
};

const BPCard = ({ record }: { record: any }) => (
  <div className="flex flex-col justify-center h-full">
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-xl font-bold text-slate-800">{record.systolic}</span>
      <span className="text-sm text-slate-300">/</span>
      <span className="text-xl font-bold text-slate-800">{record.diastolic}</span>
      <span className="text-xs text-slate-400">mmHg</span>
    </div>
    <div className="flex gap-3 text-xs text-slate-500">
      <span className="flex items-center gap-1">
        <Activity size={12} /> {record.pulse} bpm
      </span>
    </div>
  </div>
);

const DietCard = ({ record }: { record: any }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-start mb-1">
      <span className="text-sm font-bold text-slate-700">{getContextLabel(record.mealType)}</span>
      {record.calories && <span className="text-xs font-mono text-orange-500 font-bold">{record.calories} kcal</span>}
    </div>
    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100/50">
      {record.food}
    </p>
  </div>
);

const MedicationCard = ({ record }: { record: any }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-700">{record.name}</h4>
      <p className="text-xs text-slate-400 mt-0.5">剂量: {record.dosage}</p>
    </div>
  </div>
);

const WeightCard = ({ record }: { record: any }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-xl font-bold text-slate-800">{record.value}</span>
    <span className="text-xs text-slate-400">{record.unit}</span>
  </div>
);

const SleepCard = ({ record }: { record: any }) => (
  <div>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-xl font-bold text-slate-800">{record.duration}</span>
      <span className="text-xs text-slate-400">小时</span>
    </div>
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-600 font-medium">
       质量: {getContextLabel(record.quality)}
    </span>
  </div>
);

const DefaultCard = ({ record }: { record: any }) => (
  <div className="flex items-center gap-2">
    <span className="text-base font-bold text-slate-700">{record.value || record.note || '已记录'}</span>
    {record.unit && <span className="text-xs text-slate-400">{record.unit}</span>}
  </div>
);

// --- Main Timeline Component ---

export const Timeline: React.FC<TimelineProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <Clock size={48} className="mx-auto mb-4 opacity-20" />
        <p className="text-sm">暂无记录，快去添加第一条数据吧</p>
      </div>
    );
  }

  // Sort and Group Records
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);
  const groupedGroups: Record<string, BaseRecord[]> = {};
  
  sortedRecords.forEach(record => {
    const date = new Date(record.timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = new Date(new Date().setDate(today.getDate() - 1)).toDateString() === date.toDateString();
    
    let key = `${date.getMonth() + 1}月${date.getDate()}日`;
    if (isToday) key = '今天';
    if (isYesterday) key = '昨天';
    
    if (!groupedGroups[key]) groupedGroups[key] = [];
    groupedGroups[key].push(record);
  });

  return (
    <div className="mt-6 pb-6 px-1">
      {Object.entries(groupedGroups).map(([dateLabel, groupRecords], groupIdx) => (
        <div key={dateLabel} className="relative mb-8 last:mb-0">
          
          {/* Date Label (Pill) */}
          <div className="sticky top-0 z-10 flex items-center mb-4 bg-slate-50/90 backdrop-blur-sm py-2">
            <div className="px-3 py-1 bg-slate-200/60 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-200/50">
              {dateLabel}
            </div>
          </div>

          {/* Timeline Vertical Line connecting items in this group */}
          <div className="relative">
             {/* The Line */}
             <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200/60 rounded-full" />

             {/* Records List */}
             <div className="space-y-4">
               {groupRecords.map((record) => {
                 const Icon = ICONS[record.type] || Activity;
                 const colorClass = TYPE_COLORS[record.type] || TYPE_COLORS.default;
                 
                 // Render Specific Card Content
                 let CardContent = DefaultCard;
                 if (record.type === 'glucose') CardContent = GlucoseCard;
                 if (record.type === 'bp') CardContent = BPCard;
                 if (record.type === 'diet') CardContent = DietCard;
                 if (record.type === 'medication') CardContent = MedicationCard;
                 if (record.type === 'weight') CardContent = WeightCard;
                 if (record.type === 'sleep') CardContent = SleepCard;

                 return (
                   <div key={record.id} className="relative flex gap-4 pl-1">
                     
                     {/* Timeline Node (Icon) */}
                     <div className={`relative z-10 w-10 h-10 rounded-full border-[3px] border-slate-50 flex items-center justify-center shadow-sm flex-shrink-0 ${colorClass}`}>
                        <Icon size={16} strokeWidth={2.5} />
                     </div>

                     {/* Content Card */}
                     <div className="flex-1 bg-white rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-100 relative group overflow-hidden">
                        
                        {/* Decorative background element for specific types */}
                        {record.type === 'glucose' && (
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-50 to-transparent rounded-bl-full opacity-50`} />
                        )}

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider scale-90 origin-left opacity-80">
                                {record.type === 'bp' ? '血压' : record.type === 'glucose' ? '血糖' : record.type === 'diet' ? '饮食' : record.type === 'medication' ? '用药' : record.type === 'sleep' ? '睡眠' : record.type === 'weight' ? '体重' : '记录'}
                            </span>
                            <span className="text-[10px] font-medium text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-md">
                                {formatTime(record.timestamp)}
                            </span>
                        </div>
                        
                        <div className="relative z-10">
                             <CardContent record={record} />
                        </div>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>

        </div>
      ))}
    </div>
  );
};
