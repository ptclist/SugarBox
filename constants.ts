
import { BaseRecord, RecordType } from './types';

// Helper to generate random ID
const id = () => Math.random().toString(36).substr(2, 9);

// Helper to generate mock data with mixed types
const generateMockData = (): BaseRecord[] => {
  const data: BaseRecord[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Function to add a record relative to "days ago"
  const addRecord = (daysAgo: number, hour: number, type: RecordType, payload: any) => {
    const date = new Date(now - daysAgo * dayMs);
    date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
    
    data.push({
      id: id(),
      timestamp: date.getTime(),
      type,
      ...payload
    });
  };

  // Generate 3 days of data
  for (let i = 0; i < 3; i++) {
    // 1. Morning: Fasting Glucose
    addRecord(i, 7, 'glucose', {
      value: Number((5.2 + Math.random() * 1.5).toFixed(1)),
      unit: 'mmol/L',
      context: 'fasting'
    });

    // 2. Morning: Weight (every other day)
    if (i % 2 === 0) {
      addRecord(i, 7, 'weight', {
        value: Number((65 + Math.random()).toFixed(1)),
        unit: 'kg'
      });
    }

    // 3. Breakfast Diet
    addRecord(i, 8, 'diet', {
      food: '全麦面包, 鸡蛋, 牛奶',
      mealType: 'breakfast',
      calories: 350
    });

    // 4. Lunch: Medication
    addRecord(i, 12, 'medication', {
      name: '二甲双胍',
      dosage: '0.5g'
    });

    // 5. Afternoon: Glucose
    addRecord(i, 14, 'glucose', {
      value: Number((6.5 + Math.random() * 2).toFixed(1)),
      unit: 'mmol/L',
      context: 'post-lunch'
    });

    // 6. Evening: Blood Pressure (randomly)
    if (Math.random() > 0.3) {
      addRecord(i, 19, 'bp', {
        systolic: 118 + Math.floor(Math.random() * 20),
        diastolic: 75 + Math.floor(Math.random() * 10),
        pulse: 70 + Math.floor(Math.random() * 15),
        position: 'sitting'
      });
    }

    // 7. Night: Sleep (for previous night)
    addRecord(i, 23, 'sleep', {
      duration: Number((7 + Math.random()).toFixed(1)),
      quality: Math.random() > 0.5 ? 'good' : 'fair'
    });
  }

  return data.sort((a, b) => b.timestamp - a.timestamp);
};

export const INITIAL_RECORDS = generateMockData();

export const PRIVACY_TEXT = `
  <strong>隐私政策协议</strong><br/><br/>
  欢迎使用 GlucoGuard Pro（血糖管家）。我们要致力于保护您的个人健康数据。<br/><br/>
  1. <strong>数据存储：</strong> 在“游客模式”下，所有数据仅加密存储在您的本地设备上。未经您的明确登录授权，我们不会上传任何数据。<br/>
  2. <strong>数据使用：</strong> 您的健康记录仅用于为您生成趋势分析和健康洞察，绝不用于商业出售。<br/>
  3. <strong>安全保障：</strong> 我们采用行业标准加密技术保护云端同步功能的安全。<br/><br/>
  点击“同意并继续”即表示您已阅读并理解我们的条款。
`;
