import { useState } from 'react';
import { Search, Sun, Moon, Command } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/utils/cn';

interface TopBarProps {
  onSearchOpen?: () => void;
}

export default function TopBar({ onSearchOpen }: TopBarProps) {
  const { mode, toggleMode } = useThemeStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 border-b border-surface-800 bg-surface-900/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <button
        onClick={onSearchOpen}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all duration-200 max-w-md w-full',
          searchFocused
            ? 'border-brand-500 bg-surface-850'
            : 'border-surface-700 bg-surface-850/50 hover:border-surface-600'
        )}
      >
        <Search className="w-4 h-4 text-surface-500" />
        <span className="text-sm text-surface-500 flex-1 text-left">
          Search topics, algorithms, problems...
        </span>
        <div className="flex items-center gap-0.5 text-surface-600">
          <kbd className="text-[10px] px-1 py-0.5 rounded bg-surface-800 border border-surface-700 font-mono">
            <Command className="w-2.5 h-2.5 inline" />
          </kbd>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 border border-surface-700 font-mono">
            K
          </kbd>
        </div>
      </button>

      {/* Right side actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Theme toggle */}
        <button
          onClick={toggleMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-all duration-200"
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 ring-brand-400/50 transition-all">
          U
        </div>
      </div>
    </header>
  );
}
