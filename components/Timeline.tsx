
import React from 'react';
import { 
  Droplet, HeartPulse, Pill, Utensils, Weight, Ruler, 
  Thermometer, Activity, Dumbbell, Stethoscope, Moon, 
  Frown, Wind, Footprints, GlassWater, Clock 
} from 'lucide-react';
import { BaseRecord } from '../types';

interface TimelineProps {
  records: BaseRecord[];
}

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

const THEMES: Record<string, { bg: string, text: string }> = {
  glucose: { bg: 'bg-teal-50', text: 'text-teal-600' },
  bp: { bg: 'bg-rose-50', text: 'text-rose-600' },
  medication: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  diet: { bg: 'bg-orange-50', text: 'text-orange-600' },
  weight: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  sleep: { bg: 'bg-purple-50', text: 'text-purple-600' },
  mood: { bg: 'bg-pink-50', text: 'text-pink-600' },
  heartRate: { bg: 'bg-red-50', text: 'text-red-600' },
  default: { bg: 'bg-slate-100', text: 'text-slate-500' }
};

const getRecordTitle = (type: string) => {
  const map: Record<string, string> = {
    glucose: '血糖', bp: '血压', medication: '用药', diet: '饮食',
    weight: '体重', height: '身高', temperature: '体温', heartRate: '心率',
    exercise: '运动', symptoms: '症状', sleep: '睡眠', mood: '心情',
    oxygen: '血氧', steps: '步数', hydration: '饮水'
  };
  return map[type] || '记录';
};

const formatValue = (record: any) => {
  switch (record.type) {
    case 'glucose':
      const val = parseFloat(record.value);
      let colorClass = 'text-slate-800';
      if (val < 3.9) colorClass = 'text-red-500';
      if (val > 11.1) colorClass = 'text-orange-500';
      return (
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-bold ${colorClass}`}>{record.value}</span>
          <span className="text-xs text-slate-400">{record.unit}</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
             {record.context === 'fasting' ? '空腹' : 
              record.context === 'bedtime' ? '睡前' : '餐后'}
          </span>
        </div>
      );
    case 'bp':
      return (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800">{record.systolic}/{record.diastolic}</span>
            <span className="text-xs text-slate-400">mmHg</span>
          </div>
          {record.pulse && <span className="text-xs text-slate-400">心率 {record.pulse} bpm</span>}
        </div>
      );
    case 'diet':
      return (
        <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700">{record.food}</span>
            <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                <span>{record.calories ? `${record.calories} kcal` : ''}</span>
                <span className="capitalize">{record.mealType === 'breakfast' ? '早餐' : record.mealType === 'lunch' ? '午餐' : record.mealType === 'dinner' ? '晚餐' : '加餐'}</span>
            </div>
        </div>
      );
    case 'medication':
        return (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{record.name}</span>
                <span className="text-xs text-slate-400">{record.dosage}</span>
            </div>
        );
    case 'sleep':
        return (
            <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-800">{record.duration}</span>
                <span className="text-xs text-slate-400">小时</span>
                <span className="text-xs text-slate-400 ml-1">({record.quality === 'good' ? '良好' : record.quality === 'poor' ? '较差' : '极佳'})</span>
            </div>
        );
    case 'mood':
        const moods = ['很差', '较差', '一般', '不错', '开心'];
        return (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{moods[(record.scale || 3) - 1]}</span>
                {record.note && <span className="text-xs text-slate-400 truncate max-w-[150px]">{record.note}</span>}
            </div>
        );
    default:
      return (
        <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800">{record.value}</span>
            <span className="text-xs text-slate-400">{record.unit}</span>
        </div>
      );
  }
};

export const Timeline: React.FC<TimelineProps> = ({ records }) => {
  // Sort records descending
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  // Group by date
  const groupedGroups: Record<string, BaseRecord[]> = {};
  sortedRecords.forEach(record => {
    const date = new Date(record.timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();
    
    let key = `${date.getMonth() + 1}月${date.getDate()}日`;
    if (isToday) key = '今天';
    if (isYesterday) key = '昨天';
    
    if (!groupedGroups[key]) groupedGroups[key] = [];
    groupedGroups[key].push(record);
  });

  if (records.length === 0) {
      return (
          <div className="py-12 text-center text-slate-400">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">暂无记录，快去添加第一条数据吧</p>
          </div>
      );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">近期记录</h3>
      <div className="space-y-6">
        {Object.entries(groupedGroups).map(([date, groupRecords]) => (
          <div key={date} className="relative">
             {/* Sticky Date Header for long lists, or just header */}
             <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm py-2 mb-2 flex items-center">
                 <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">{date}</span>
             </div>
             
             <div className="relative pl-4 space-y-4">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200"></div>

                {groupRecords.map((record, idx) => {
                    const Icon = ICONS[record.type] || Activity;
                    const theme = THEMES[record.type] || THEMES.default;

                    return (
                        <div key={record.id} className="relative flex gap-4 items-start group">
                            {/* Dot/Icon on Line */}
                            <div className={`relative z-10 w-10 h-10 rounded-full border-4 border-slate-50 flex-shrink-0 flex items-center justify-center ${theme.bg} ${theme.text}`}>
                                <Icon size={16} />
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{getRecordTitle(record.type)}</span>
                                    <span className="text-xs text-slate-300 font-mono">
                                        {new Date(record.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="mt-1">
                                    {formatValue(record)}
                                </div>
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
