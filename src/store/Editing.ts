import create from 'zustand';

export const useWorkflowStore = create((set) => ({
  isEditing: false,
  setIsEditing: (value: boolean) => set({ isEditing: value }),
}));
