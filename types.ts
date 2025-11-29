
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export type RecordType = 
  | 'glucose' 
  | 'bp' 
  | 'medication' 
  | 'diet'
  | 'weight'
  | 'height'
  | 'temperature'
  | 'heartRate'
  | 'exercise'
  | 'symptoms'
  | 'sleep'
  | 'mood'
  | 'oxygen'
  | 'steps'
  | 'hydration';

export interface BaseRecord {
  id: string;
  timestamp: number;
  type: RecordType;
  [key: string]: any; // Payload specific to the type
}

// Specific Payload Interfaces
export interface GlucoseData {
  value: number;
  unit: 'mmol/L' | 'mg/dL';
  context: 'fasting' | 'post-meal' | 'pre-meal' | 'bedtime' | 'post-breakfast' | 'post-lunch' | 'post-dinner';
}

export interface GlucoseRecord extends BaseRecord, GlucoseData {
  type: 'glucose';
}

export interface BPData {
  systolic: number;
  diastolic: number;
  pulse?: number;
  position?: 'sitting' | 'lying' | 'standing';
  arm?: 'left' | 'right';
}

export interface DietData {
  food: string;
  calories?: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MedicationData {
  name: string;
  dosage: string;
  unit?: string;
}

export interface SleepData {
  duration: number; // hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  bedTime?: string;
  wakeTime?: string;
}

export interface MoodData {
  scale: 1 | 2 | 3 | 4 | 5;
  factors: string[];
  note?: string;
}

export interface AppState {
  privacyAccepted: boolean;
  user: User | null;
  records: BaseRecord[]; 
}