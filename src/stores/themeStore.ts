import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'dark' | 'light';
  toggleMode: () => void;
  setMode: (mode: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleMode: () =>
        set((state) => {
          const newMode = state.mode === 'dark' ? 'light' : 'dark';
          if (newMode === 'light') {
            document.body.classList.add('light');
          } else {
            document.body.classList.remove('light');
          }
          return { mode: newMode };
        }),
      setMode: (mode) => {
        if (mode === 'light') {
          document.body.classList.add('light');
        } else {
          document.body.classList.remove('light');
        }
        set({ mode });
      },
    }),
    {
      name: 'codepulse-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.mode === 'light') {
          document.body.classList.add('light');
        }
      },
    }
  )
);
