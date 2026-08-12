import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { topics } from '@/data/topics';
import { useProgressStore } from '@/stores/progressStore';
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function LearnPage() {
  const { topicsCompleted } = useProgressStore();

  const categories = [
    { id: 'arrays', name: 'Arrays & Strings' },
    { id: 'sorting', name: 'Sorting & Searching' },
    { id: 'linkedList', name: 'Linked Lists' },
    { id: 'trees', name: 'Trees & Graphs' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-surface-100 mb-2">Topic Library</h1>
        <p className="text-surface-400">
          Master computer science concepts through interactive visualizations.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => {
          const categoryTopics = topics.filter((t) => t.category === category.id);
          
          if (categoryTopics.length === 0) return null;

          return (
            <section key={category.id}>
              <h2 className="text-xl font-bold text-surface-200 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-brand-400" />
                </div>
                {category.name}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTopics.map((topic, idx) => {
                  const isCompleted = topicsCompleted.includes(topic.id);

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        to={`/topic/${topic.id}`}
                        className="glass-card glass-card-hover p-6 flex flex-col h-full group block transition-all duration-300 relative overflow-hidden"
                      >
                        {isCompleted && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-success-500/10 rounded-bl-3xl flex items-start justify-end p-3">
                            <CheckCircle2 className="w-5 h-5 text-success-500" />
                          </div>
                        )}
                        
                        <div className="text-4xl mb-4">{topic.icon}</div>
                        <h3 className="text-lg font-bold text-surface-100 mb-2 group-hover:text-brand-400 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-surface-400 leading-relaxed flex-1">
                          {topic.description}
                        </p>
                        
                        <div className="mt-6 flex items-center justify-between border-t border-surface-800/50 pt-4">
                          <span className={cn(
                            "text-xs font-semibold px-2 py-1 rounded-md",
                            isCompleted ? "bg-success-500/10 text-success-400" : "bg-surface-800 text-surface-400"
                          )}>
                            {isCompleted ? 'Mastered' : 'Not started'}
                          </span>
                          
                          <div className="flex items-center gap-1 text-sm font-medium text-brand-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
