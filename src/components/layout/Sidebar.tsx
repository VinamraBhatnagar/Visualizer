import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Play,
  Code2,
  Map,
  Trophy,
  BarChart3,
  Gamepad2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shapes,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProgressStore } from '@/stores/progressStore';
import { LEVELS } from '@/types/progress';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const mainNav: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Play, label: 'Visualizer', path: '/visualizer' },
  { icon: Code2, label: 'Problems', path: '/problems' },
  { icon: Shapes, label: 'OOP', path: '/oop' },
  { icon: Gamepad2, label: 'Challenges', path: '/challenges' },
  { icon: Map, label: 'Roadmap', path: '/roadmap' },
];

const bottomNav: NavItem[] = [
  { icon: BarChart3, label: 'Progress', path: '/progress' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);

  const levelInfo = useMemo(() => {
    const info = LEVELS.find((l) => xp >= l.minXP && xp < l.maxXP) ?? LEVELS[0];
    const progress = ((xp - info.minXP) / (info.maxXP - info.minXP)) * 100;
    return {
      level: info.level,
      title: info.title,
      progress: Math.min(100, progress),
      color: info.color,
    };
  }, [xp]);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r transition-all duration-300 ease-out',
        'border-surface-800 bg-surface-900/95 backdrop-blur-xl',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight gradient-text">
            CodePulse
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-full" />
              )}
              <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-brand-400')} />
              {!collapsed && <span>{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-brand-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-800 text-surface-100 text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* XP / Level indicator */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-surface-850 border border-surface-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-surface-300">
              Level {levelInfo.level}
            </span>
            <span className="text-xs font-bold" style={{ color: levelInfo.color }}>
              {levelInfo.title}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${levelInfo.progress}%`,
                background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-surface-500">{xp} XP</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px]">🔥</span>
              <span className="text-[10px] font-semibold text-warning-400">
                {streak}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="border-t border-surface-800 py-3 px-2 space-y-1">
        {bottomNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-800 text-surface-100 text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface-800 border border-surface-700 rounded-full flex items-center justify-center hover:bg-surface-700 transition-colors z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-surface-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-surface-400" />
        )}
      </button>
    </aside>
  );
}
