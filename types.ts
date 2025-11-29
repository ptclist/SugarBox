export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export type RecordType = 'glucose' | 'bp' | 'medication' | 'diet';

export interface GlucoseRecord {
  id: string;
  value: number; // mmol/L
  type: 'fasting' | 'post-meal' | 'random';
  timestamp: number;
}

export interface BPRecord {
  id: string;
  systolic: number;
  diastolic: number;
  position: 'sitting' | 'lying';
  timestamp: number;
}

export interface MedRecord {
  id: string;
  name: string;
  dosage: string;
  timestamp: number;
}

export interface DietRecord {
  id: string;
  food: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
}

export interface AppState {
  privacyAccepted: boolean;
  user: User | null;
  glucoseRecords: GlucoseRecord[];
  bpRecords: BPRecord[];
  medRecords: MedRecord[];
  dietRecords: DietRecord[];
}