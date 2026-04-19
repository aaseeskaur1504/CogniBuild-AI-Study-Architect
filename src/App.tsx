import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Search,
  BrainCircuit,
  Lightbulb,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Trophy,
  History
} from 'lucide-react';
import { generateStudyKit, type StudyKit } from './services/ai';
import { cn } from './lib/utils';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState<StudyKit | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'concepts' | 'quiz'>('roadmap');
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [allProgress, setAllProgress] = useState<Record<string, number[]>>({});

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('study_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedProgress = localStorage.getItem('cognibuild_progress');
    if (savedProgress) setAllProgress(JSON.parse(savedProgress));
  }, []);

  const handleGenerate = async (e?: React.FormEvent, historicalQuery?: string) => {
    e?.preventDefault();
    const targetQuery = historicalQuery || query;
    if (!targetQuery.trim()) return;

    setLoading(true);
    try {
      const data = await generateStudyKit(targetQuery);
      setKit(data);
      setActiveTab('roadmap');
      
      // Load progress for this specific topic
      const savedProgress = localStorage.getItem('cognibuild_progress');
      const parsedProgress = savedProgress ? JSON.parse(savedProgress) : {};
      setCompletedPhases(parsedProgress[targetQuery] || []);
      
      setQuizStep(0);
      setScore(0);
      setQuizFinished(false);

      const newHistory = [targetQuery, ...history.filter(h => h !== targetQuery)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('study_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to generate kit:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setKit(null);
    setQuery('');
  };

  const progressPercentage = kit 
    ? Math.round((completedPhases.length / kit.roadmap.length) * 100) 
    : 0;

  const togglePhase = (idx: number) => {
    if (!kit) return;
    
    const newCompleted = completedPhases.includes(idx) 
      ? completedPhases.filter(i => i !== idx) 
      : [...completedPhases, idx];
    
    setCompletedPhases(newCompleted);
    
    // Save to global progress state and localStorage
    const savedProgress = localStorage.getItem('cognibuild_progress');
    const parsedProgress = savedProgress ? JSON.parse(savedProgress) : {};
    const updatedAllProgress = {
      ...parsedProgress,
      [kit.topic]: newCompleted
    };
    setAllProgress(updatedAllProgress);
    localStorage.setItem('cognibuild_progress', JSON.stringify(updatedAllProgress));
  };

  return (
    <div className="min-h-screen bg-page-bg text-text-main selection:bg-blue-100 selection:text-primary">
      {/* Header */}
      <header className="h-[70px] bg-surface border-b border-border sticky top-0 z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-6 h-6 bg-primary rounded-[4px]"></div>
          <span className="font-extrabold text-xl tracking-wider text-text-main uppercase">
            CogniBuild
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <button onClick={() => window.location.reload()} className="text-primary hover:brightness-110">Dashboard</button>
          <button onClick={() => alert("Resource Library: Connecting to logical database...")} className="text-text-secondary hover:text-primary transition-colors">Resources</button>
          <button onClick={() => alert("Career Pathways: Visualizing future schema...")} className="text-text-secondary hover:text-primary transition-colors">Pathways</button>
          <div className="w-10 h-10 bg-[#DFE6E9] rounded-full ml-4 flex items-center justify-center font-bold text-text-muted text-xs">ARCH</div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-10 py-10">
        {/* Welcome Section */}
        {!kit && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 text-left"
            >
              <div className="label-caps mb-6">Learning Path Architect</div>
              <h1 className="text-5xl font-extrabold tracking-tight text-text-main mb-6 leading-tight">
                Design your academic <span className="text-primary underline decoration-4 underline-offset-8">Blueprint</span>
              </h1>
              <p className="text-lg text-text-secondary mb-12 max-w-2xl font-medium">
                Transform subjects into structured data grids, active tasks, and mastery roadmaps with high-fidelity AI logic.
              </p>

              <form onSubmit={handleGenerate} className="relative max-w-xl mb-16">
                <input 
                  type="text" 
                  placeholder="What subject are we engineering today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-6 pr-32 py-4 bg-surface border border-border rounded-xl text-lg focus:border-primary focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all text-sm"
                >
                  GENERATE
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Data Structures', 'FinTech', 'Modern Art', 'Bio-Informatics'].map((topic) => (
                  <div 
                    key={topic}
                    onClick={() => { handleGenerate(undefined, topic); }}
                    className="geometric-card p-4 cursor-pointer hover:border-primary transition-all group flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-text-muted transition-colors group-hover:text-primary mb-0.5 uppercase tracking-tighter">Recommended</div>
                      <div className="text-sm font-bold text-text-main">{topic}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* History Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4"
            >
              <div className="geometric-card p-6 bg-surface/50 h-full">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                  <History size={16} className="text-text-muted" />
                  <div className="label-caps text-xs">Recent Architectures</div>
                </div>
                {history.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-xs font-bold text-text-muted italic">No structural logs found.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleGenerate(undefined, item)}
                        className="p-3 border border-border rounded-lg bg-page-bg hover:border-primary cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <span className="text-sm font-bold text-text-secondary group-hover:text-text-main">{item}</span>
                        <ChevronRight size={14} className="text-text-muted group-hover:text-primary" />
                      </div>
                    ))}
                    <button 
                      onClick={() => { 
                        localStorage.removeItem('study_history'); 
                        localStorage.removeItem('cognibuild_progress');
                        setHistory([]); 
                        setAllProgress({});
                      }}
                      className="w-full text-[10px] font-black text-text-muted hover:text-danger-text uppercase tracking-widest pt-4"
                    >
                      Clear Memory Keys
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="text-primary mb-6"
            >
              <RefreshCw size={40} />
            </motion.div>
            <div className="label-caps animate-pulse">Computing Logical Schema...</div>
          </div>
        )}

        {/* Study Kit Result */}
        {kit && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[10px] font-black text-text-muted hover:text-primary transition-colors mb-4 uppercase tracking-[0.2em]"
            >
              <ArrowLeft size={14} /> Back to Design Hub
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <div className="label-caps mb-4">ACTIVE PROJECT</div>
                <div className="geometric-card p-5 border-l-4 border-l-primary">
                  <div className="text-lg font-bold text-text-main mb-1">{kit.topic}</div>
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-tight">AI Generated Kit</div>
                  <div className="mt-4 px-2 py-1 bg-border rounded text-[10px] font-black text-text-secondary inline-block">BCA HUB</div>
                </div>
              </div>

              <div>
                <div className="label-caps mb-4">NAVIGATION</div>
                <div className="geometric-card overflow-hidden">
                  {[
                    { id: 'roadmap', label: 'Dashboard', icon: Clock },
                    { id: 'concepts', label: 'Repos & Knowledge', icon: BookOpen },
                    { id: 'quiz', label: 'Success Metrics', icon: GraduationCap }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "w-full flex items-center gap-3 px-6 py-4 transition-all text-left text-sm font-bold",
                        activeTab === tab.id ? "bg-blue-50/50 text-primary border-l-4 border-l-primary" : "text-text-secondary hover:bg-page-bg border-l-4 border-l-transparent"
                      )}
                    >
                      <tab.icon size={16} /> {tab.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[#FEB2B2] bg-[#FFF5F5]">
                <div className="text-[10px] font-black text-danger-text uppercase tracking-widest mb-2">SYSTEM ALERT</div>
                <div className="text-sm font-bold text-text-main mb-1">Final Sync Pending</div>
                <div className="text-xs text-text-secondary">Review all components to commit knowledge.</div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === 'roadmap' && (
                  <motion.div 
                    key="roadmap"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <h2 className="text-xl font-extrabold text-text-main uppercase tracking-tight italic">Logical Pathway</h2>
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-bold text-text-muted uppercase">Global Progress</div>
                        <div className="w-32 h-2 bg-[#DFE6E9] rounded-full overflow-hidden">
                          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="text-xs font-black text-success">{progressPercentage}%</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {kit.roadmap.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => togglePhase(idx)}
                          className={cn(
                            "geometric-card p-6 flex gap-6 hover:border-primary transition-all cursor-pointer",
                            completedPhases.includes(idx) && "bg-emerald-50/30 border-success/30"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center font-extrabold transition-all",
                            completedPhases.includes(idx) ? "bg-success text-white" : "bg-[#F1F2F6] text-text-secondary"
                          )}>
                            {completedPhases.includes(idx) ? <CheckCircle2 size={24} /> : `0${idx + 1}`}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={cn(
                                "font-bold uppercase text-sm tracking-wide transition-all",
                                completedPhases.includes(idx) ? "text-success line-through opacity-60" : "text-text-main"
                              )}>
                                {item.phase}
                              </h3>
                              <span className="text-[11px] font-bold text-text-secondary bg-border px-2 py-0.5 rounded uppercase">{item.duration}</span>
                            </div>
                            <p className={cn(
                              "text-sm leading-relaxed font-medium transition-all",
                              completedPhases.includes(idx) ? "text-text-muted italic" : "text-text-secondary"
                            )}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'concepts' && (
                  <motion.div 
                    key="concepts"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="space-y-6"
                  >
                     <div className="border-b border-border pb-4">
                      <h2 className="text-xl font-extrabold text-text-main uppercase tracking-tight italic">Component Architecture</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {kit.keyConcepts.map((concept, idx) => (
                        <div key={idx} className="geometric-card p-8 flex flex-col h-full hover:border-primary transition-all">
                          <h3 className="font-extrabold text-lg text-text-main mb-3 uppercase tracking-tight underline decoration-primary decoration-2 underline-offset-4">{concept.term}</h3>
                          <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed font-medium">{concept.definition}</p>
                          <div className="space-y-2 pt-4 border-t border-border">
                            <div className="label-caps mb-2 text-[10px]">Logical Implementations</div>
                            {concept.examples.map((ex, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                                <div className="w-3 h-3 border-2 border-primary rounded-[2px]" />
                                {ex}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'quiz' && (
                  <motion.div 
                    key="quiz"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="space-y-6"
                   >
                     <div className="border-b border-border pb-4 flex justify-between items-center">
                        <h2 className="text-xl font-extrabold text-text-main uppercase tracking-tight italic">Validation Metrics</h2>
                        {!quizFinished && (
                          <div className="label-caps text-xs">Step {quizStep + 1} of {kit.quickQuiz.length}</div>
                        )}
                    </div>

                    {!quizFinished ? (
                      <div className="space-y-8">
                        <QuizItem 
                          key={quizStep}
                          question={kit.quickQuiz[quizStep]} 
                          index={quizStep} 
                          onNext={(isCorrect) => {
                            if (isCorrect) setScore(s => s + 1);
                            if (quizStep < kit.quickQuiz.length - 1) {
                              setQuizStep(s => s + 1);
                            } else {
                              setQuizFinished(true);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="geometric-card p-12 text-center"
                      >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                          <Trophy size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-text-main mb-2 uppercase italic tracking-tighter">Architecture Certified</h3>
                        <p className="text-text-secondary font-medium mb-10 text-lg">You scored {score} out of {kit.quickQuiz.length}.</p>
                        
                        <div className="max-w-md mx-auto mb-12">
                          <div className="flex justify-between text-[10px] font-black text-text-muted mb-4 uppercase tracking-widest">
                            <span>Logic Level</span>
                            <span>{Math.round((score/kit.quickQuiz.length)*100)}% Proficiency</span>
                          </div>
                          {/* Rank Slider */}
                          <div className="h-6 bg-border rounded-full relative overflow-hidden flex items-center px-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(score/kit.quickQuiz.length)*100}%` }}
                              className="h-4 bg-primary rounded-full relative transition-all"
                            >
                              <div className="absolute top-0 right-0 -mr-2 -mt-1 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <span className="text-[10px] font-black text-text-muted uppercase">Foundation</span>
                            <span className="text-[10px] font-black text-primary uppercase">Architect</span>
                          </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                          <button 
                            onClick={() => { setQuizStep(0); setScore(0); setQuizFinished(false); }}
                            className="bg-surface border border-border text-text-main px-8 py-3 rounded-lg font-bold hover:bg-page-bg transition-all text-sm uppercase tracking-wider"
                          >
                            Recalibrate Logic
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </main>

      <footer className="mt-20 border-t border-border bg-surface py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-text-muted rounded-sm"></div>
            <span className="font-extrabold text-sm tracking-wider text-text-main uppercase">
              Project Architecture Hub
            </span>
          </div>
          <div className="flex gap-10">
            <div className="space-y-2">
              <div className="label-caps text-[9px]">Infrastructure</div>
              <div className="text-xs font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors uppercase">GitHub Sync</div>
              <div className="text-xs font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors uppercase">Logical Logs</div>
            </div>
            <div className="space-y-2">
              <div className="label-caps text-[9px]">Governance</div>
              <div className="text-xs font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors uppercase">Privacy Protocol</div>
              <div className="text-xs font-bold text-text-secondary hover:text-primary cursor-pointer transition-colors uppercase">License Schema</div>
            </div>
          </div>
          <div className="text-right">
             <div className="label-caps text-[9px] mb-2 underline decoration-primary underline-offset-2">Commit Hash 0x984E3</div>
             <p className="text-xs font-bold text-text-muted">© 2026 BCA ARCHITECT PROJECT</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuizItem({ question, index, onNext }: { question: StudyKit['quickQuiz'][0], index: number, onNext: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="geometric-card p-10 group overflow-hidden relative">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-5 h-5 bg-border rounded-sm flex items-center justify-center font-black text-text-secondary text-[10px]">
          {index + 1}
        </div>
        <h3 className="text-lg font-bold text-text-main leading-tight tracking-tight uppercase italic">{question.question}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option) => (
          <button
            key={option}
            disabled={!!selected}
            onClick={() => { setSelected(option); setShowExplanation(true); }}
            className={cn(
              "p-4 border text-left transition-all relative font-bold text-sm",
              !selected && "border-border hover:border-primary bg-surface",
              selected === option && option === question.correctAnswer && "bg-emerald-50 border-success text-emerald-900",
              selected === option && option !== question.correctAnswer && "bg-rose-50 border-danger-text text-danger-text",
              selected && option === question.correctAnswer && "border-success bg-emerald-50",
              selected && option !== question.correctAnswer && option !== selected && "border-border bg-page-bg opacity-40 shadow-inner"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "checkbox-custom shrink-0",
                selected === option && "checked",
                selected && option === question.correctAnswer && "checked bg-success border-success"
              )} />
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-10 overflow-hidden"
          >
            <div className={cn(
              "p-6 border-l-4 mb-8",
              isCorrect ? "bg-emerald-50 border-l-success" : "bg-[#FFF5F5] border-l-danger-text"
            )}>
              <div className="label-caps mb-2 text-text-main">Architectural Analysis</div>
              <p className="text-sm font-medium leading-relaxed text-text-secondary italic">{question.explanation}</p>
            </div>
            
            <button 
              onClick={() => onNext(isCorrect)}
              className="bg-primary text-white w-full py-3 rounded-lg font-bold hover:brightness-110 flex items-center justify-center gap-2 group"
            >
              COMMIT AND CONTINUE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

