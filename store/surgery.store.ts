import { create } from "zustand";

interface SurgeryState {
  data: any;
  setData: (data: any) => void;
  reset: () => void;
}

export const useSurgeryStore = create<SurgeryState>((set) => ({
  data: {},
  setData: (payload) =>
    set((state) => ({ data: { ...state.data, ...payload } })),
  reset: () => set({ data: {} }),
}));
