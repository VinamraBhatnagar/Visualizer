import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Code2,
  Eye,
  Brain,
  Layers,
  GitBranch,
  Zap,
  Trophy,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

/* ─────────────────────── Animated Code Visualization ─────────────────────── */

const DEMO_STEPS = [
  { line: 1, arr: [64, 34, 25, 12, 22], i: -1, j: 0, comparing: [0, 1], sorted: [], explanation: 'Starting Bubble Sort — compare first two elements' },
  { line: 3, arr: [64, 34, 25, 12, 22], i: 0, j: 0, comparing: [0, 1], sorted: [], explanation: 'Compare arr[0]=64 > arr[1]=34 → Swap!' },
  { line: 5, arr: [34, 64, 25, 12, 22], i: 0, j: 1, comparing: [1, 2], sorted: [], explanation: 'Compare arr[1]=64 > arr[2]=25 → Swap!' },
  { line: 5, arr: [34, 25, 64, 12, 22], i: 0, j: 2, comparing: [2, 3], sorted: [], explanation: 'Compare arr[2]=64 > arr[3]=12 → Swap!' },
  { line: 5, arr: [34, 25, 12, 64, 22], i: 0, j: 3, comparing: [3, 4], sorted: [], explanation: 'Compare arr[3]=64 > arr[4]=22 → Swap!' },
  { line: 3, arr: [34, 25, 12, 22, 64], i: 0, j: 4, comparing: [], sorted: [4], explanation: '64 bubbled to the end! ✓' },
  { line: 5, arr: [25, 34, 12, 22, 64], i: 1, j: 1, comparing: [1, 2], sorted: [4], explanation: 'Pass 2: Compare arr[1]=34 > arr[2]=12 → Swap!' },
  { line: 5, arr: [25, 12, 34, 22, 64], i: 1, j: 2, comparing: [2, 3], sorted: [4], explanation: 'Compare arr[2]=34 > arr[3]=22 → Swap!' },
  { line: 3, arr: [25, 12, 22, 34, 64], i: 1, j: 3, comparing: [], sorted: [3, 4], explanation: '34 in place! ✓' },
  { line: 5, arr: [12, 25, 22, 34, 64], i: 2, j: 0, comparing: [0, 1], sorted: [3, 4], explanation: 'Pass 3: arr[0]=12 < arr[1]=25 — No swap needed' },
  { line: 5, arr: [12, 22, 25, 34, 64], i: 2, j: 1, comparing: [1, 2], sorted: [3, 4], explanation: 'Compare arr[1]=25 > arr[2]=22 → Swap!' },
  { line: 3, arr: [12, 22, 25, 34, 64], i: 2, j: 2, comparing: [], sorted: [2, 3, 4], explanation: 'Almost done! 25 in place! ✓' },
  { line: 3, arr: [12, 22, 25, 34, 64], i: 3, j: 0, comparing: [], sorted: [1, 2, 3, 4], explanation: 'Final pass — no swaps needed!' },
  { line: 8, arr: [12, 22, 25, 34, 64], i: 4, j: 0, comparing: [], sorted: [0, 1, 2, 3, 4], explanation: '🎉 Array sorted! Time: O(n²), Space: O(1)' },
];

const DEMO_CODE_LINES = [
  'function bubbleSort(arr) {',
  '  for (let i = 0; i < n-1; i++) {',
  '    for (let j = 0; j < n-i-1; j++) {',
  '      if (arr[j] > arr[j+1]) {',
  '        swap(arr[j], arr[j+1]);',
  '      }',
  '    }',
  '  }',
  '}',
];

function HeroVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % DEMO_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const currentStep = DEMO_STEPS[step];

  const getCellColor = useCallback((index: number) => {
    if (currentStep.sorted.includes(index)) return 'from-success-500 to-success-600';
    if (currentStep.comparing.includes(index)) return 'from-warning-400 to-warning-500';
    return 'from-brand-500 to-brand-600';
  }, [currentStep]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl" />

        <div className="flex gap-6 relative z-10">
          {/* Code panel */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-error-500/80" />
              <div className="w-3 h-3 rounded-full bg-warning-500/80" />
              <div className="w-3 h-3 rounded-full bg-success-500/80" />
              <span className="ml-2 text-xs text-surface-500 font-mono">bubble_sort.js</span>
            </div>
            <div className="font-mono text-xs space-y-0.5">
              {DEMO_CODE_LINES.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-2 py-0.5 rounded transition-all duration-300 ${
                    idx === currentStep.line ? 'bg-brand-500/20 text-brand-300' : 'text-surface-400'
                  }`}
                >
                  <span className="w-4 text-right text-surface-600 select-none text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Array viz */}
          <div className="w-48 shrink-0">
            <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-3">
              Array State
            </p>
            <div className="flex flex-col gap-1.5">
              {currentStep.arr.map((val, idx) => (
                <motion.div
                  key={`${idx}-${val}`}
                  layout
                  className={`relative flex items-center gap-2`}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <span className="w-4 text-[10px] text-surface-600 text-right font-mono">
                    {idx}
                  </span>
                  <div
                    className={`flex-1 h-7 rounded-md bg-gradient-to-r ${getCellColor(idx)} flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300`}
                  >
                    {val}
                  </div>
                  {currentStep.comparing.includes(idx) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[10px] text-warning-400 font-bold"
                    >
                      ◄
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Variables */}
            <div className="mt-4 space-y-1">
              {currentStep.i >= 0 && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-accent-400 font-mono font-bold">i</span>
                  <span className="text-surface-500">=</span>
                  <span className="text-surface-200 font-mono">{currentStep.i}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-accent-400 font-mono font-bold">j</span>
                <span className="text-surface-500">=</span>
                <span className="text-surface-200 font-mono">{currentStep.j}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/50"
          >
            <p className="text-xs text-surface-300">
              <span className="text-brand-400 font-semibold">Step {step + 1}:</span>{' '}
              {currentStep.explanation}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1 mt-3">
          {DEMO_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                idx === step
                  ? 'w-4 bg-brand-500'
                  : idx < step
                    ? 'bg-brand-500/40'
                    : 'bg-surface-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Feature Cards ─────────────────────── */

const features = [
  {
    icon: Eye,
    title: 'Visual Execution',
    description: 'Watch every variable, pointer, and data structure change in real time as your code executes step by step.',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    icon: Trophy,
    title: '1st - 4th College Track',
    description: 'Year-by-year syllabus mapping and curated LeetCode problem progression from Freshman basics to Senior FAANG prep.',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    icon: Code2,
    title: 'Professional Editor',
    description: 'Write code in Java, Python, C++, or JavaScript with full syntax highlighting, autocomplete, and error detection.',
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    icon: Brain,
    title: 'Problem-Solving Guide',
    description: 'Learn to think algorithmically. Our guided approach teaches pattern recognition, not memorization.',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    icon: Layers,
    title: '10+ Data Structures',
    description: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, HashMaps — all beautifully visualized and interactive.',
    gradient: 'from-success-500 to-success-600',
  },
  {
    icon: GitBranch,
    title: 'Recursion Unwound',
    description: 'Finally understand recursion. See the call stack build and unwind with parameters and return values at each frame.',
    gradient: 'from-warning-400 to-warning-500',
  },
];

/* ─────────────────────── Stats ─────────────────────── */

const stats = [
  { value: '15+', label: 'Algorithms' },
  { value: '10+', label: 'Data Structures' },
  { value: '50+', label: 'Problems' },
  { value: '4', label: 'Languages' },
];

/* ─────────────────────── Topics Preview ─────────────────────── */

const topicPreviews = [
  { title: 'Sorting', desc: 'Bubble, Selection, Merge, Quick Sort', icon: '📊' },
  { title: 'Trees', desc: 'BST, AVL, Heap, Trie', icon: '🌳' },
  { title: 'Graphs', desc: 'BFS, DFS, Dijkstra, MST', icon: '🔗' },
  { title: 'Recursion', desc: 'Call stack, Backtracking, DP', icon: '🔄' },
  { title: 'OOP', desc: 'Classes, Inheritance, Polymorphism', icon: '🏗️' },
  { title: 'Hashing', desc: 'HashMap, Collisions, Frequency', icon: '#️⃣' },
];

/* ─────────────────────── Main Page ─────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The future of learning DSA & OOP</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            See Your Code{' '}
            <span className="gradient-text">Come Alive</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Learn Data Structures & Algorithms by watching every variable, pointer,
            function call, and data structure change in real time. Don't just read the
            code — <span className="text-surface-200 font-medium">understand it</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/learn"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-5 h-5" />
              Start Learning
            </Link>
            <Link
              to="/visualizer"
              className="flex items-center gap-2 px-8 py-3.5 bg-surface-800 hover:bg-surface-750 text-surface-200 font-semibold rounded-xl border border-surface-700 hover:border-surface-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye className="w-5 h-5" />
              Explore Visualizations
            </Link>
          </motion.div>

          {/* Hero Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <HeroVisualization />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-surface-800 bg-surface-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm text-surface-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="gradient-text">master DSA</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              More than just code. A complete learning environment designed to build
              real algorithmic thinking.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card glass-card-hover p-6 group cursor-pointer transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-surface-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Preview */}
      <section className="py-20 px-6 bg-surface-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore <span className="gradient-text">Topics</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              From arrays to advanced graph algorithms, every topic comes with
              interactive visualizations and guided explanations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicPreviews.map((topic, idx) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card glass-card-hover p-5 flex items-center gap-4 cursor-pointer group"
              >
                <span className="text-3xl">{topic.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-100">{topic.title}</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{topic.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How <span className="gradient-text">CodePulse</span> Works
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Choose a Topic', desc: 'Select from Arrays, Trees, Graphs, Sorting, OOP, and more.', icon: BookOpen },
              { step: '02', title: 'Read & Understand', desc: 'Get a clear, visual explanation with real-world analogies.', icon: Brain },
              { step: '03', title: 'Write or Load Code', desc: 'Use our professional code editor with syntax highlighting and autocomplete.', icon: Code2 },
              { step: '04', title: 'Visualize Step by Step', desc: 'Watch every operation animate. See variables change, pointers move, structures transform.', icon: Eye },
              { step: '05', title: 'Practice & Master', desc: 'Solve interactive challenges, earn XP, and track your progress.', icon: Trophy },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 border border-brand-500/20 flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-brand-400" />
                    {item.title}
                  </h3>
                  <p className="text-surface-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-brand-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to see your code come alive?
              </h2>
              <p className="text-surface-400 mb-8 max-w-lg mx-auto">
                Join thousands of students who are learning DSA and OOP the visual
                way. Start your journey today — it's free.
              </p>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold gradient-text">CodePulse</span>
          </div>
          <p className="text-sm text-surface-500">
            Built with ❤️ for students who want to truly understand algorithms.
          </p>
        </div>
      </footer>
    </div>
  );
}
