import { create } from 'zustand';

export interface ClientCondition {
  sido: string;
  sigungu: string;
  dong?: string;
  lifecycle: string[];
  ageValue?: number;
  household: string[];
  conditions: string[];
  incomeLevel?: string;
  topicFilter?: string;
}

interface ConditionState {
  condition: ClientCondition;
  setSido: (sido: string) => void;
  setSigungu: (sigungu: string) => void;
  setDong: (dong: string) => void;
  toggleLifecycle: (lifecycle: string) => void;
  toggleHousehold: (household: string) => void;
  toggleCondition: (condition: string) => void;
  setIncomeLevel: (level: string) => void;
  resetFilters: () => void;
}

const initialCondition: ClientCondition = {
  sido: '',
  sigungu: '',
  lifecycle: [],
  household: [],
  conditions: [],
};

export const useConditionStore = create<ConditionState>((set) => ({
  condition: initialCondition,
  setSido: (sido) => set((state) => ({ 
    condition: { ...state.condition, sido, sigungu: '', dong: '' } 
  })),
  setSigungu: (sigungu) => set((state) => ({ 
    condition: { ...state.condition, sigungu, dong: '' } 
  })),
  setDong: (dong) => set((state) => ({ 
    condition: { ...state.condition, dong } 
  })),
  toggleLifecycle: (value) => set((state) => {
    const current = state.condition.lifecycle;
    const next = current.includes(value) 
      ? current.filter(i => i !== value) 
      : [...current, value];
    return { condition: { ...state.condition, lifecycle: next } };
  }),
  toggleHousehold: (value) => set((state) => {
    const current = state.condition.household;
    const next = current.includes(value) 
      ? current.filter(i => i !== value) 
      : [...current, value];
    return { condition: { ...state.condition, household: next } };
  }),
  toggleCondition: (value) => set((state) => {
    const current = state.condition.conditions;
    const next = current.includes(value) 
      ? current.filter(i => i !== value) 
      : [...current, value];
    return { condition: { ...state.condition, conditions: next } };
  }),
  setIncomeLevel: (incomeLevel) => set((state) => ({
    condition: { ...state.condition, incomeLevel }
  })),
  resetFilters: () => set({ condition: initialCondition }),
}));
