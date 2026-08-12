import { useState } from 'react';
import { motion } from 'motion/react';
import { problems } from '@/data/problems';
import { useProgressStore } from '@/stores/progressStore';
import { Code2, Search, Filter, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const { problemsSolved } = useProgressStore();

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = filterDifficulty ? p.difficulty === filterDifficulty : true;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-100 mb-2">Problem Set</h1>
          <p className="text-surface-400">
            Practice your skills with interactive coding challenges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input 
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors w-full md:w-64"
            />
          </div>
          
          <div className="flex bg-surface-900 border border-surface-700 rounded-lg p-1">
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(filterDifficulty === diff ? null : diff)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors",
                  filterDifficulty === diff 
                    ? diff === 'easy' ? 'bg-success-500/20 text-success-400'
                    : diff === 'medium' ? 'bg-warning-500/20 text-warning-400'
                    : 'bg-error-500/20 text-error-400'
                  : "text-surface-500 hover:text-surface-300 hover:bg-surface-800"
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProblems.map((problem, idx) => {
          const isSolved = problemsSolved.includes(problem.id);

          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card glass-card-hover p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {isSolved ? (
                    <CheckCircle2 className="w-6 h-6 text-success-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-surface-700 group-hover:text-brand-500 transition-colors" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-100 group-hover:text-brand-400 transition-colors">
                    {problem.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                      problem.difficulty === 'easy' ? 'bg-success-500/10 text-success-400 border border-success-500/20' :
                      problem.difficulty === 'medium' ? 'bg-warning-500/10 text-warning-400 border border-warning-500/20' :
                      'bg-error-500/10 text-error-400 border border-error-500/20'
                    )}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-surface-500 px-2 py-0.5 bg-surface-800 rounded">
                      {problem.category}
                    </span>
                    {problem.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] text-surface-500 border border-surface-700 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:border-l border-surface-800 sm:pl-6">
                <div className="text-center hidden sm:block">
                  <div className="text-xs text-surface-500">Pattern</div>
                  <div className="text-sm font-semibold text-accent-400 capitalize">{problem.pattern}</div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-brand-600 text-surface-200 hover:text-white rounded-lg text-sm font-semibold transition-all">
                  <Code2 className="w-4 h-4" />
                  Solve
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredProblems.length === 0 && (
          <div className="text-center py-20 text-surface-500">
            No problems found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
