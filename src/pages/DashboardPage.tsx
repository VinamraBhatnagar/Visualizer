import { useProgressStore } from '@/stores/progressStore';
import { Trophy, Flame, Target, BookOpen, Clock, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/utils/cn';

export default function DashboardPage() {
  const {
    xp,
    streak,
    topicsCompleted,
    problemsSolved,
    hintsUsed,
    totalTime,
    getLevel
  } = useProgressStore();

  const levelInfo = getLevel();

  const stats = [
    { label: 'Topics Mastered', value: topicsCompleted.length, icon: BookOpen, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Problems Solved', value: problemsSolved.length, icon: Target, color: 'text-success-400', bg: 'bg-success-500/10' },
    { label: 'Current Streak', value: `${streak} days`, icon: Flame, color: 'text-warning-400', bg: 'bg-warning-500/10' },
    { label: 'Hints Used', value: hintsUsed, icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-100 mb-2">Your Progress</h1>
        <p className="text-surface-400">Track your journey to algorithmic mastery.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Main Level Card */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-2xl bg-surface-800 flex items-center justify-center border border-surface-700 shadow-xl">
              <span className="text-4xl font-bold" style={{ color: levelInfo.color }}>
                {levelInfo.level}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-sm text-surface-400 font-semibold mb-1">Current Rank</div>
                  <div className="text-2xl font-bold text-surface-100">{levelInfo.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-400">{xp} XP</div>
                </div>
              </div>
              
              <div className="w-full h-3 bg-surface-800 rounded-full overflow-hidden border border-surface-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`,
                  }}
                />
              </div>
              <div className="text-right text-[10px] text-surface-500 mt-1">
                {levelInfo.progress.toFixed(1)}% to next level
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-accent-400" />
          </div>
          <div className="text-sm text-surface-400 font-medium mb-1">Time Learning</div>
          <div className="text-3xl font-bold font-mono text-surface-100">
            {formatTime(totalTime)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-100">{stat.value}</div>
              <div className="text-xs text-surface-400 font-medium">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements Preview */}
      <h2 className="text-xl font-bold text-surface-100 mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-warning-400" />
        Recent Achievements
      </h2>
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4 opacity-50">
          <Trophy className="w-8 h-8 text-surface-600" />
        </div>
        <h3 className="text-surface-200 font-semibold mb-2">No achievements yet</h3>
        <p className="text-surface-500 text-sm max-w-sm">
          Complete topics and solve problems to unlock achievements and earn bonus XP.
        </p>
      </div>
    </div>
  );
}
