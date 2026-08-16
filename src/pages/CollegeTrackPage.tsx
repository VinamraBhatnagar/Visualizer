import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { COLLEGE_CURRICULUM } from '@/data/collegeCurriculum';
import type { CollegeYear } from '@/types/curriculum';
import { useProgressStore } from '@/stores/progressStore';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Play,
  Lightbulb,
  Building2,
  Clock,
  Code2,
  Target,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function CollegeTrackPage() {
  const {
    selectedCollegeYear = 1,
    setSelectedCollegeYear,
    solvedLeetCodeIds = [],
    toggleSolvedLeetCode,
    completedCurriculumTopicIds = [],
    toggleCompletedCurriculumTopic,
  } = useProgressStore();

  const [activeYear, setActiveYear] = useState<CollegeYear>(selectedCollegeYear || 1);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [coreOnly, setCoreOnly] = useState(false);

  const currentCurriculum = COLLEGE_CURRICULUM[activeYear];

  // Calculate year-specific solved count
  const allProblemsInYear = currentCurriculum.semesters.flatMap((s) => s.problems);
  const solvedCountInYear = allProblemsInYear.filter((p) => solvedLeetCodeIds.includes(p.id)).length;
  const progressPercent = Math.round((solvedCountInYear / Math.max(1, allProblemsInYear.length)) * 100);

  const handleYearChange = (year: CollegeYear) => {
    setActiveYear(year);
    setSelectedCollegeYear(year);
  };

  const difficultyColors = {
    easy: 'text-success-400 bg-success-500/10 border-success-500/20',
    medium: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
    hard: 'text-error-400 bg-error-500/10 border-error-500/20',
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-900 via-surface-900/90 to-surface-850 border border-surface-800 p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              University Syllabus & Placement Roadmap
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-surface-100 tracking-tight">
              College DSA Curriculum by Year
            </h1>
            <p className="text-surface-400 text-sm md:text-base leading-relaxed">
              Structured step-by-step roadmap from 1st Year coding fundamentals to 4th Year FAANG interview mastery, mapped to your college semester syllabus.
            </p>
          </div>

          {/* Year stats badge */}
          <div className="bg-surface-800/80 border border-surface-700/60 rounded-xl p-5 shrink-0 flex flex-col gap-3 min-w-[240px] shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-surface-400">Year {activeYear} Progress</span>
              <span className="text-xs font-bold text-brand-400">{progressPercent}% Solved</span>
            </div>
            <div className="w-full h-2 bg-surface-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-surface-400 pt-1 border-t border-surface-700/50">
              <span>{solvedCountInYear} / {allProblemsInYear.length} LeetCode Done</span>
              <span className="flex items-center gap-1 text-warning-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> +25 XP / solve
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Year Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([1, 2, 3, 4] as CollegeYear[]).map((year) => {
          const item = COLLEGE_CURRICULUM[year];
          const isSelected = activeYear === year;

          return (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={cn(
                'relative flex flex-col p-4 rounded-xl text-left border transition-all duration-300 group overflow-hidden',
                isSelected
                  ? 'bg-surface-850 border-brand-500 shadow-glow shadow-brand-500/10'
                  : 'bg-surface-900/60 border-surface-800 hover:border-surface-700 hover:bg-surface-850/50'
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{item.icon}</span>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border',
                    isSelected
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                      : 'bg-surface-800 text-surface-400 border-surface-700'
                  )}
                >
                  Year {year}
                </span>
              </div>
              <span className="font-bold text-surface-100 text-sm group-hover:text-brand-300 transition-colors">
                {item.badge}
              </span>
              <span className="text-xs text-surface-400 mt-1 line-clamp-1">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Year Overview Banner */}
      <div
        className={cn(
          'p-6 rounded-xl border bg-gradient-to-r transition-all duration-300',
          currentCurriculum.accentGradient,
          'border-surface-800/80 bg-surface-900/40'
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentCurriculum.icon}</span>
              <h2 className="text-xl font-bold text-surface-100">{currentCurriculum.title}</h2>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed">
              {currentCurriculum.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/90 border border-surface-700">
              <Clock className="w-4 h-4 text-brand-400" />
              <div>
                <div className="font-bold text-surface-200">{currentCurriculum.recommendedDailyMinutes} mins/day</div>
                <div className="text-[10px] text-surface-400">Target daily practice</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/90 border border-surface-700">
              <Target className="w-4 h-4 text-accent-400" />
              <div>
                <div className="font-bold text-surface-200">{currentCurriculum.totalTargetProblems} Problems</div>
                <div className="text-[10px] text-surface-400">Curated Year Benchmark</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Goals & Academic Subjects */}
        <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-surface-800/60">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-brand-400" />
              Primary Milestones for Year {activeYear}
            </h3>
            <ul className="space-y-1.5 text-xs text-surface-300">
              {currentCurriculum.primaryGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">✓</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent-400" />
              Aligned University Semester Subjects
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentCurriculum.academicSyllabusSubjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs bg-surface-800/80 text-surface-300 border border-surface-700"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls for Problem Practice */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-900 border border-surface-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-bold text-surface-300">Filter Problems:</span>
          <div className="flex items-center gap-1">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors',
                  difficultyFilter === diff
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCoreOnly(!coreOnly)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            coreOnly
              ? 'bg-accent-500/20 text-accent-300 border-accent-500/40'
              : 'bg-surface-800 text-surface-400 border-surface-700 hover:text-surface-200'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {coreOnly ? 'Showing Core (Must-Do) Only' : 'Show All Curated'}
        </button>
      </div>

      {/* Semester by Semester Breakdown */}
      <div className="space-y-12">
        {currentCurriculum.semesters.map((sem) => {
          const filteredProblems = sem.problems.filter((p) => {
            if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
            if (coreOnly && !p.isCore) return false;
            return true;
          });

          return (
            <motion.section
              key={sem.semester}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Semester Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-surface-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-surface-100">{sem.title}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      Semester {sem.semester}
                    </span>
                  </div>
                  <p className="text-xs text-surface-400 mt-1">{sem.focusGoal}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px] text-surface-400">
                  <span className="font-semibold text-surface-500">Courses:</span>
                  {sem.academicCourses.map((c, i) => (
                    <span key={i} className="text-surface-300">
                      {c}{i < sem.academicCourses.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics to Learn in this Semester */}
              <div className="grid md:grid-cols-3 gap-4">
                {sem.topics.map((topic) => {
                  const isDone = completedCurriculumTopicIds.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className={cn(
                        'glass-card p-5 flex flex-col justify-between rounded-xl border transition-all duration-200 relative overflow-hidden',
                        isDone ? 'border-success-500/40 bg-success-950/10' : 'border-surface-800 hover:border-surface-700'
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl">{topic.icon}</div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-[10px] font-bold uppercase px-2 py-0.5 rounded',
                                topic.importance === 'Essential'
                                  ? 'bg-error-500/10 text-error-400 border border-error-500/20'
                                  : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                              )}
                            >
                              {topic.importance}
                            </span>
                            <button
                              onClick={() => toggleCompletedCurriculumTopic(topic.id)}
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                                isDone
                                  ? 'bg-success-500 text-white'
                                  : 'bg-surface-800 text-surface-500 hover:text-surface-300'
                              )}
                              title={isDone ? 'Mark as incomplete' : 'Mark as mastered (+50 XP)'}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-surface-100 mb-1">{topic.title}</h3>
                        <p className="text-xs text-surface-400 mb-4 leading-relaxed">{topic.description}</p>

                        <div className="space-y-1 mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                            Key Concepts:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.subtopics.map((sub, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded bg-surface-850 text-surface-300 border border-surface-750"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-surface-800/60 flex items-center justify-between text-xs">
                        <span className="text-surface-400">
                          {topic.recommendedProblemsCount} target problems
                        </span>
                        {topic.visualizerTemplate ? (
                          <Link
                            to="/visualizer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Visualize
                          </Link>
                        ) : (
                          <Link
                            to="/learn"
                            className="inline-flex items-center gap-1 text-xs font-bold text-surface-400 hover:text-surface-200 transition-colors"
                          >
                            Study <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Curated LeetCode Practice List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-surface-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-400" />
                    Curated LeetCode Practice ({filteredProblems.length} Problems)
                  </h3>
                </div>

                <div className="grid gap-3">
                  {filteredProblems.map((prob) => {
                    const isSolved = solvedLeetCodeIds.includes(prob.id);

                    return (
                      <div
                        key={prob.id}
                        className={cn(
                          'p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4',
                          isSolved
                            ? 'bg-success-950/20 border-success-500/30'
                            : 'bg-surface-900/80 border-surface-800 hover:border-surface-700'
                        )}
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <button
                            onClick={() => toggleSolvedLeetCode(prob.id)}
                            className={cn(
                              'mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all',
                              isSolved
                                ? 'bg-success-500 border-success-400 text-white'
                                : 'border-surface-700 bg-surface-800 hover:border-surface-600 text-transparent'
                            )}
                            title={isSolved ? 'Mark unsolved' : 'Mark solved (+25 XP)'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono text-surface-500">#{prob.leetcodeNumber}</span>
                              <span className={cn('font-bold text-sm text-surface-100', isSolved && 'line-through text-surface-400')}>
                                {prob.title}
                              </span>
                              <span
                                className={cn(
                                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded border',
                                  difficultyColors[prob.difficulty]
                                )}
                              >
                                {prob.difficulty}
                              </span>
                              {prob.isCore && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-500/10 text-accent-400 border border-accent-500/20">
                                  CORE
                                </span>
                              )}
                              {prob.acceptanceRate && (
                                <span className="text-[10px] text-surface-500">
                                  Acc: {prob.acceptanceRate}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-surface-400 leading-relaxed">
                              <span className="font-semibold text-surface-300">Why It Matters:</span> {prob.whyImportant}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[11px] font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                                Pattern: {prob.pattern}
                              </span>

                              {prob.companies && prob.companies.length > 0 && (
                                <div className="flex items-center gap-1 text-[11px] text-surface-500">
                                  <Building2 className="w-3 h-3" />
                                  <span>{prob.companies.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {prob.platformProblemId && (
                            <Link
                              to={`/problems`}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 border border-brand-500/30 transition-colors"
                            >
                              Solve in IDE
                            </Link>
                          )}
                          <a
                            href={prob.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-800 text-surface-200 hover:text-white hover:bg-surface-700 transition-colors"
                          >
                            LeetCode
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Senior Pro Tips Section */}
      <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800 space-y-4">
        <h3 className="text-base font-bold text-surface-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning-400" />
          Senior Engineer & Placement Tips for Year {activeYear}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {currentCurriculum.proTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-850 border border-surface-800 text-xs text-surface-300 leading-relaxed space-y-1.5">
              <div className="font-bold text-brand-400">Rule #{idx + 1}</div>
              <div>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
