import { create } from "zustand";

type State = {
  areLabelsShowing?: boolean;
};

type Action = {
  toggleShowLabels?: () => void;
};

export const useDevStore = create<State & Action>((set, get) => ({
  areLabelsShowing: true,
  toggleShowLabels: () => set({ areLabelsShowing: !get().areLabelsShowing }),
}));
