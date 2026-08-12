import {
  Copy,
  Download,
  RotateCcw,
  Settings,
  Minus,
  Plus,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import type { Language } from '@/types/execution';
import { cn } from '@/utils/cn';

const LANGUAGES: { value: Language; label: string; icon: string }[] = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'java', label: 'Java', icon: 'JV' },
  { value: 'cpp', label: 'C++', icon: 'C+' },
];

export default function EditorToolbar() {
  const { language, fontSize, setLanguage, setFontSize, resetCode, code } = useEditorStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const extensions: Record<Language, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
    };
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-surface-900 border-b border-surface-800">
      {/* Language selector */}
      <div className="flex items-center gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200',
              language === lang.value
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                : 'text-surface-500 hover:text-surface-300 hover:bg-surface-800'
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Font size */}
        <div className="flex items-center gap-0.5 mr-2">
          <button
            onClick={() => setFontSize(fontSize - 1)}
            className="w-6 h-6 rounded flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
            aria-label="Decrease font size"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-surface-500 font-mono w-5 text-center">
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize(fontSize + 1)}
            className="w-6 h-6 rounded flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
            aria-label="Increase font size"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-7 h-7 rounded-md flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          title="Copy code"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDownload}
          className="w-7 h-7 rounded-md flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          title="Download code"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetCode}
          className="w-7 h-7 rounded-md flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          title="Reset code"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-7 h-7 rounded-md flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
