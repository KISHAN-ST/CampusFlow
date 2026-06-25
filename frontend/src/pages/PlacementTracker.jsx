import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Briefcase, Brain, Trophy, ChevronRight, ChevronLeft,
  Loader2, RotateCcw, CheckCircle2, XCircle, Sparkles,
  Plus, Trash2, CalendarDays,
} from 'lucide-react';
import { mockTest as generateMockTest, prepPlan as generatePrepPlan } from '../api/ai';

// ── Shared styles ─────────────────────────────────────────
const card  = 'bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card';
const input = `w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
  placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-4 py-3 text-[14px] font-medium
  outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 border-0`;
const btnPrimary = 'bg-blue-600 hover:bg-blue-500 active:scale-[0.97] disabled:opacity-50 text-white text-[14px] font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20';

const TABS = [
  { id: 'tracker',   label: 'Applications',  icon: Briefcase },
  { id: 'prepplan',  label: 'AI Prep Plan',  icon: Sparkles },
  { id: 'mocktest',  label: 'Mock Test',     icon: Brain },
];

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Zoho', 'Flipkart', 'Swiggy', 'Other'];
const ROLES     = ['Software Engineer', 'Data Analyst', 'Full Stack Developer', 'DevOps Engineer', 'ML Engineer', 'Product Manager', 'Other'];
const ROUNDS    = ['Applied', 'Online Test', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Offer Received'];
const DIFFS     = ['easy', 'medium', 'hard'];
const COUNTS    = [5, 10, 15];

// ── Applications Tracker ──────────────────────────────────
function ApplicationsTab() {
  const [apps, setApps]       = useState([]);
  const [showForm, setForm]   = useState(false);
  const [entry, setEntry]     = useState({ company: 'Google', role: 'Software Engineer', round: 'Applied', date: '' });

  const set = (f) => (e) => setEntry((p) => ({ ...p, [f]: e.target.value }));

  const addApp = () => {
    if (!entry.date) return toast.error('Please add an application date');
    setApps((p) => [{ ...entry, id: Date.now() }, ...p]);
    setEntry({ company: 'Google', role: 'Software Engineer', round: 'Applied', date: '' });
    setForm(false);
    toast.success('Application added!');
  };

  const removeApp = (id) => setApps((p) => p.filter((a) => a.id !== id));

  const roundColor = (r) => {
    if (r === 'Offer Received')  return 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400';
    if (r === 'Applied')         return 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400';
    if (r === 'HR Round')        return 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400';
    return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">{apps.length} application{apps.length !== 1 ? 's' : ''} tracked</p>
        <button
          onClick={() => setForm((p) => !p)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Application
        </button>
      </div>

      {showForm && (
        <div className={`${card} p-5 animate-scale-in`}>
          <p className="font-semibold text-[14px] mb-4">New Application</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Company</label>
              <select value={entry.company} onChange={set('company')} className={input}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Role</label>
              <select value={entry.role} onChange={set('role')} className={input}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Current Stage</label>
              <select value={entry.round} onChange={set('round')} className={input}>
                {ROUNDS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Date Applied</label>
              <input type="date" value={entry.date} onChange={set('date')} className={input} />
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setForm(false)} className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-semibold py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
            <button onClick={addApp} className={`flex-1 ${btnPrimary} py-2.5`}>Add</button>
          </div>
        </div>
      )}

      {apps.length === 0 && !showForm ? (
        <div className={`${card} p-12 text-center`}>
          <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="font-semibold text-zinc-500 dark:text-zinc-400">No applications yet</p>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-1">Start tracking your placement journey.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((app, i) => (
            <div key={app.id} style={{ animationDelay: `${i * 40}ms` }} className={`${card} p-4 flex items-center gap-4 hover:shadow-md transition-all animate-fade-up`}>
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px]">{app.company}</p>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">{app.role}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${roundColor(app.round)}`}>{app.round}</span>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(app.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <button onClick={() => removeApp(app.id)} className="w-7 h-7 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Prep Plan ──────────────────────────────────────────
function PrepPlanTab() {
  const [form, setForm]     = useState({ company: 'Google', role: 'Software Engineer', roundsCleared: '', daysLeft: '14' });
  const [plan, setPlan]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan('');
    try {
      const { data } = await generatePrepPlan(form);
      setPlan(data.data.plan);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
          <h3 className="font-semibold text-[15px]">Generate Prep Plan</h3>
        </div>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Company</label>
              <select value={form.company} onChange={set('company')} className={input}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Role</label>
              <select value={form.role} onChange={set('role')} className={input}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Rounds Cleared (optional)</label>
            <input value={form.roundsCleared} onChange={set('roundsCleared')} placeholder="e.g. Online Test, Technical Round 1" className={input} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Days Until Interview</label>
            <input type="number" min="1" max="90" value={form.daysLeft} onChange={set('daysLeft')} className={input} />
          </div>
          <button type="submit" disabled={loading} className={`w-full ${btnPrimary}`}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Plan</>}
          </button>
        </form>
      </div>

      <div className={`${card} p-6 min-h-[300px] flex flex-col`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="font-semibold text-[15px]">Your Prep Plan</h3>
        </div>
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
            <p className="text-[13px] text-zinc-400 animate-pulse">AI is building your plan...</p>
          </div>
        )}
        {!loading && !plan && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <Brain className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
            <p className="text-[13px] text-zinc-400 dark:text-zinc-500">Your personalized plan will appear here.</p>
          </div>
        )}
        {plan && !loading && (
          <div className="flex-1 overflow-y-auto">
            <pre className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-pre-wrap leading-relaxed font-sans animate-fade-up">{plan}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mock Test ─────────────────────────────────────────────
function MockTestTab() {
  const [step, setStep]       = useState('config');
  const [config, setConfig]   = useState({ company: 'Google', role: 'Software Engineer', difficulty: 'medium', count: 5 });
  const [questions, setQs]    = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const setC = (f) => (e) => setConfig((p) => ({ ...p, [f]: e.target.value }));

  const startTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await generateMockTest(config);
      setQs(data.data.questions);
      setAnswers(new Array(data.data.questions.length).fill(null));
      setCurrent(0);
      setStep('quiz');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate test');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optIndex) => {
    if (answers[current] !== null) return;
    setAnswers((p) => { const n = [...p]; n[current] = optIndex; return n; });
  };

  const next = () => { if (current < questions.length - 1) setCurrent((p) => p + 1); else setStep('results'); };
  const prev = () => { if (current > 0) setCurrent((p) => p - 1); };
  const reset = () => { setStep('config'); setQs([]); setAnswers([]); setCurrent(0); };

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;

  // Config
  if (step === 'config') return (
    <div className="max-w-lg">
      <div className={`${card} p-6`}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
            <Brain className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-semibold text-[15px]">Configure Mock Test</h3>
        </div>
        <form onSubmit={startTest} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Company</label>
              <select value={config.company} onChange={setC('company')} className={input}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Role</label>
              <select value={config.role} onChange={setC('role')} className={input}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Difficulty</label>
              <select value={config.difficulty} onChange={setC('difficulty')} className={input}>
                {DIFFS.map((d) => <option key={d} className="capitalize">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Questions</label>
              <select value={config.count} onChange={setC('count')} className={input}>
                {COUNTS.map((c) => <option key={c} value={c}>{c} Questions</option>)}
              </select>
            </div>
          </div>
          <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl p-3.5">
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              🎯 AI will generate {config.count} {config.difficulty}-level questions covering DSA, {config.role}-specific skills, and system design for <strong>{config.company}</strong> interviews.
            </p>
          </div>
          <button type="submit" disabled={loading} className={`w-full ${btnPrimary}`}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Test...</> : <><Brain className="w-4 h-4" /> Start Mock Test</>}
          </button>
        </form>
      </div>
    </div>
  );

  // Quiz
  if (step === 'quiz') {
    const q = questions[current];
    const selected = answers[current];
    const answered = selected !== null;

    return (
      <div className="max-w-2xl animate-fade-up">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">
              Question {current + 1} of {questions.length}
            </p>
            <span className="text-[11px] font-semibold text-zinc-400 bg-[#f5f5f7] dark:bg-[#2c2c2e] px-2.5 py-1 rounded-full capitalize">
              {config.difficulty} · {config.company}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`${card} p-6`}>
          {/* Question */}
          <p className="text-[16px] font-semibold leading-relaxed mb-5">{q.question}</p>

          {/* Options */}
          <div className="space-y-2.5 mb-5">
            {q.options.map((opt, i) => {
              let style = 'bg-[#f5f5f7] dark:bg-[#2c2c2e] border-transparent hover:border-blue-400';
              if (answered) {
                if (i === q.correct) style = 'bg-green-50 dark:bg-green-950/40 border-green-500 text-green-800 dark:text-green-300';
                else if (i === selected && selected !== q.correct) style = 'bg-red-50 dark:bg-red-950/40 border-red-400 text-red-700 dark:text-red-300';
                else style = 'bg-[#f5f5f7] dark:bg-[#2c2c2e] border-transparent opacity-60';
              }
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  disabled={answered}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left text-[14px] font-medium transition-all duration-150 ${answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'} ${style}`}
                >
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[11px] font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answered && i === q.correct && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto shrink-0" />}
                  {answered && i === selected && selected !== q.correct && <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3.5 mb-4 animate-fade-up">
              <p className="text-[12px] font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 Explanation</p>
              <p className="text-[13px] text-blue-800 dark:text-blue-300">{q.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2.5">
            <button onClick={prev} disabled={current === 0} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl text-[14px] font-semibold disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={next}
              disabled={!answered}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${answered ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] opacity-40 cursor-not-allowed'}`}
            >
              {current === questions.length - 1 ? 'See Results' : 'Next'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (step === 'results') {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 80 ? { label: 'Excellent!', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/40' }
      : pct >= 60 ? { label: 'Good Job!', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' }
      : { label: 'Keep Practicing', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' };

    return (
      <div className="max-w-2xl animate-fade-up">
        {/* Score card */}
        <div className={`${card} p-8 text-center mb-5`}>
          <div className={`w-20 h-20 ${grade.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Trophy className={`w-10 h-10 ${grade.color}`} />
          </div>
          <p className={`text-[32px] font-bold ${grade.color}`}>{pct}%</p>
          <p className="text-[18px] font-semibold mt-1">{grade.label}</p>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
            {score} of {questions.length} correct · {config.role} at {config.company}
          </p>
          <button onClick={reset} className={`${btnPrimary} mx-auto mt-5 px-6`}>
            <RotateCcw className="w-4 h-4" /> New Test
          </button>
        </div>

        {/* Question review */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest px-1">Question Review</p>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct;
            return (
              <div key={i} className={`${card} p-4`}>
                <div className="flex items-start gap-3">
                  {correct
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  }
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold mb-2">{q.question}</p>
                    <p className="text-[12px] text-green-700 dark:text-green-400 font-medium">✓ {q.options[q.correct]}</p>
                    {!correct && <p className="text-[12px] text-red-600 dark:text-red-400 mt-0.5">✗ You chose: {q.options[answers[i]] ?? 'No answer'}</p>}
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

// ── Main Page ─────────────────────────────────────────────
export default function PlacementTracker() {
  const [tab, setTab] = useState('tracker');
  const Active = tab === 'tracker' ? ApplicationsTab : tab === 'prepplan' ? PrepPlanTab : MockTestTab;

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto lg:mx-0">
      <div className="mb-6 animate-fade-up">
        <h1 className="text-[24px] lg:text-[28px] font-bold tracking-tight">Placement Tracker</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mt-1">
          Track applications, get AI prep plans, and take role-specific mock tests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl p-1 mb-6 animate-fade-up">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
              tab === id
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="animate-fade-up">
        <Active />
      </div>
    </div>
  );
}
