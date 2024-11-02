import { create } from 'zustand';

export interface WorkflowState {
  isSaved: boolean;
  setIsSaved: (value: boolean) => void;
}

export const useIsWorkflowSavedStore = create<WorkflowState>((set) => ({
  isSaved: true,
  setIsSaved: (value: boolean) => set({ isSaved: value }),
}));
