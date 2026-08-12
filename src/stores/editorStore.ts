import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types/execution';

interface EditorState {
  code: string;
  language: Language;
  fontSize: number;
  showMinimap: boolean;
  wordWrap: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  setFontSize: (size: number) => void;
  toggleMinimap: () => void;
  toggleWordWrap: () => void;
  resetCode: () => void;
  defaultCode: Record<Language, string>;
}

const DEFAULT_CODES: Record<Language, string> = {
  javascript: `// Welcome to CodePulse!
// Let's visualize Bubble Sort

function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

const arr = [64, 34, 25, 12, 22, 11, 90];
bubbleSort(arr);`,
  python: `# Welcome to CodePulse!
# Let's visualize Bubble Sort

def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

arr = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(arr)`,
  java: `// Welcome to CodePulse!
// Let's visualize Bubble Sort

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
    }
}`,
  cpp: `// Welcome to CodePulse!
// Let's visualize Bubble Sort

#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    return 0;
}`,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      code: DEFAULT_CODES.javascript,
      language: 'javascript',
      fontSize: 14,
      showMinimap: false,
      wordWrap: true,
      defaultCode: DEFAULT_CODES,
      setCode: (code) => set({ code }),
      setLanguage: (language) =>
        set({
          language,
          code: DEFAULT_CODES[language],
        }),
      setFontSize: (fontSize) => set({ fontSize: Math.min(24, Math.max(10, fontSize)) }),
      toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),
      toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),
      resetCode: () => set((state) => ({ code: get().defaultCode[state.language] })),
    }),
    {
      name: 'codepulse-editor',
      partialize: (state) => ({
        language: state.language,
        fontSize: state.fontSize,
        showMinimap: state.showMinimap,
        wordWrap: state.wordWrap,
      }),
    }
  )
);
