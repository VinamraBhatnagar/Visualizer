import { motion } from 'motion/react';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import { cn } from '@/utils/cn';

const roadmapData = [
  { id: 'l1', title: 'Level 1: Foundations', description: 'Big O, Arrays, Strings', status: 'completed' },
  { id: 'l2', title: 'Level 2: Core Data Structures', description: 'Linked List, Stack, Queue', status: 'current' },
  { id: 'l3', title: 'Level 3: Core Algorithms', description: 'Sorting, Searching, Two Pointers', status: 'locked' },
  { id: 'l4', title: 'Level 4: Trees & Graphs', description: 'BST, BFS, DFS', status: 'locked' },
  { id: 'l5', title: 'Level 5: Advanced', description: 'Dynamic Programming, Greedy', status: 'locked' },
];

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-surface-100 mb-4">DSA Learning Path</h1>
        <p className="text-surface-400 max-w-lg mx-auto">
          Follow this structured roadmap to master Data Structures and Algorithms from scratch.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-8 bottom-8 w-1 bg-surface-800 rounded-full" />
        
        <div className="space-y-8 relative z-10">
          {roadmapData.map((node, idx) => (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-6"
            >
              {/* Node Icon */}
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-surface-950 shadow-xl transition-all duration-300",
                node.status === 'completed' ? "bg-success-500/20 text-success-500 border-success-500/30" :
                node.status === 'current' ? "bg-brand-500 text-white shadow-brand-500/40" :
                "bg-surface-800 text-surface-500"
              )}>
                {node.status === 'completed' && <CheckCircle2 className="w-8 h-8" />}
                {node.status === 'current' && <Play className="w-8 h-8 ml-1" />}
                {node.status === 'locked' && <Lock className="w-8 h-8" />}
              </div>

              {/* Node Content */}
              <div className={cn(
                "glass-card p-6 flex-1 transition-all duration-300",
                node.status === 'current' ? "border-brand-500/50 shadow-glow" :
                node.status === 'locked' ? "opacity-60" : ""
              )}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn(
                    "text-xl font-bold",
                    node.status === 'current' ? "text-brand-400" : "text-surface-100"
                  )}>
                    {node.title}
                  </h3>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                    node.status === 'completed' ? "bg-success-500/10 text-success-400" :
                    node.status === 'current' ? "bg-brand-500/10 text-brand-400" :
                    "bg-surface-800 text-surface-500"
                  )}>
                    {node.status}
                  </span>
                </div>
                <p className="text-surface-400">{node.description}</p>
                
                {node.status === 'current' && (
                  <button className="mt-4 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-lg transition-colors">
                    Continue Learning
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
