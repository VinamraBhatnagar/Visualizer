import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Play, Code2, Map } from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Play, label: 'Visualize', path: '/visualizer' },
  { icon: Code2, label: 'Problems', path: '/problems' },
  { icon: Map, label: 'Roadmap', path: '/roadmap' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur-xl border-t border-surface-800 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all',
                isActive
                  ? 'text-brand-400'
                  : 'text-surface-500 active:text-surface-300'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
