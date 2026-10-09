'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { createStore, useStore } from 'zustand';
import type { Service } from '../types';

type SelectedService = Pick<Service, 'title' | 'image'>;

export type Panel = 'wallet' | 'notifications' | 'profile' | 'service' | null;
type HomeState = {
  compactHeader: boolean;
  remainingScroll: number | null;
  setScrollState: (compactHeader: boolean, remainingScroll: number) => void;
  panel: Panel;
  selectedService: SelectedService | null;
  setPanel: (panel: Exclude<Panel, 'service'>) => void;
  openService: (service: SelectedService) => void;
};
function createHomeStore() {
  return createStore<HomeState>()((set) => ({
    compactHeader: false,
    remainingScroll: null,
    setScrollState: (compactHeader, remainingScroll) =>
      set((state) =>
        state.compactHeader === compactHeader && state.remainingScroll === remainingScroll
          ? state
          : { compactHeader, remainingScroll },
      ),
    panel: null,
    selectedService: null,
    setPanel: (panel) => set({ panel, selectedService: null }),
    openService: (service) =>
      set({ panel: 'service', selectedService: { title: service.title, image: service.image } }),
  }));
}
const HomeContext = createContext<ReturnType<typeof createHomeStore> | null>(null);
export function HomeStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createHomeStore);
  return <HomeContext.Provider value={store}>{children}</HomeContext.Provider>;
}
export function useHomeStore<T>(selector: (state: HomeState) => T) {
  const store = useContext(HomeContext);
  if (!store) throw new Error('useHomeStore requires HomeStoreProvider');
  return useStore(store, selector);
}
