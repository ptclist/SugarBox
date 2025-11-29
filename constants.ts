import { GlucoseRecord } from './types';

// Generate last 7 days of mock data
const generateMockData = (): GlucoseRecord[] => {
  const data: GlucoseRecord[] = [];
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    data.push({
      id: `mock-${i}`,
      value: Number((5.5 + Math.random() * 2).toFixed(1)), // Random between 5.5 and 7.5
      type: 'fasting',
      timestamp: now - i * 24 * 60 * 60 * 1000,
    });
  }
  return data;
};

export const INITIAL_GLUCOSE_DATA = generateMockData();

export const PRIVACY_TEXT = `
  <strong>隐私政策协议</strong><br/><br/>
  欢迎使用 GlucoGuard Pro（血糖管家）。我们要致力于保护您的个人健康数据。<br/><br/>
  1. <strong>数据存储：</strong> 在“游客模式”下，所有数据仅加密存储在您的本地设备上。未经您的明确登录授权，我们不会上传任何数据。<br/>
  2. <strong>数据使用：</strong> 您的健康记录仅用于为您生成趋势分析和健康洞察，绝不用于商业出售。<br/>
  3. <strong>安全保障：</strong> 我们采用行业标准加密技术保护云端同步功能的安全。<br/><br/>
  点击“同意并继续”即表示您已阅读并理解我们的条款。
`;