import { useParams, Link } from 'react-router-dom';
import { topics } from '@/data/topics';
import { ArrowLeft, Play, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';

export default function TopicPage() {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);
  const { completeTopic } = useProgressStore();

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <p className="text-surface-400">Topic not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24">
      {/* Header */}
      <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </Link>
      
      <div className="flex items-start justify-between mb-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{topic.icon}</span>
            <h1 className="text-4xl font-bold text-surface-100">{topic.title}</h1>
          </div>
          <p className="text-lg text-surface-400">{topic.description}</p>
        </div>
        
        <Link 
          to="/visualizer"
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5" />
          Visualize Algorithm
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-12">
        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 text-sm font-bold">1</span>
            </div>
            What is it?
          </h2>
          <p className="text-surface-200 leading-relaxed text-lg">{topic.whatIsIt}</p>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center">
              <span className="text-accent-400 text-sm font-bold">2</span>
            </div>
            Why do we need it?
          </h2>
          <p className="text-surface-200 leading-relaxed text-lg">{topic.whyWeNeedIt}</p>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center">
              <span className="text-success-400 text-sm font-bold">3</span>
            </div>
            Real-world Analogy
          </h2>
          <div className="p-6 rounded-xl bg-success-500/10 border border-success-500/20">
            <p className="text-surface-100 leading-relaxed italic">"{topic.analogy}"</p>
          </div>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-warning-400" />
            Complexity
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface-800 border border-surface-700">
              <h3 className="font-semibold text-surface-200 mb-4">Time Complexity</h3>
              <ul className="space-y-2">
                {Object.entries(topic.complexity.time).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between">
                    <span className="text-surface-400 capitalize">{key}</span>
                    <span className="font-mono font-bold text-warning-400">{value as String}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-surface-800 border border-surface-700">
              <h3 className="font-semibold text-surface-200 mb-4">Space Complexity</h3>
              <ul className="space-y-2">
                {Object.entries(topic.complexity.space).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between">
                    <span className="text-surface-400 capitalize">{key}</span>
                    <span className="font-mono font-bold text-success-400">{value as String}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-error-400" />
            Common Mistakes
          </h2>
          <ul className="space-y-3">
            {topic.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-error-400 mt-2 shrink-0" />
                <span className="text-surface-200 leading-relaxed">{mistake}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex justify-center pt-8">
          <button 
            onClick={() => completeTopic(topic.id)}
            className="px-8 py-4 bg-success-600 hover:bg-success-500 text-white rounded-xl font-bold shadow-lg shadow-success-500/25 transition-all hover:scale-105"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
}
