import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, CalendarDays, Lightbulb, ArrowRight, Layers } from 'lucide-react';
import { getStudent } from '../api/student';
import { getAllTasks } from '../api/task';

const AI_TIPS = [
  'Review notes within 24 hours of a lecture — retention jumps by 60%.',
  'Pomodoro: 25 min deep focus, 5 min break. Repeat 4×, then take a long break.',
  'Teach what you learned — it\'s the fastest way to find the gaps in your knowledge.',
  'Set 3 concrete goals before every study session, not vague ones.',
  'Sleep 7–8 hours before an exam. It consolidates memory better than any all-nighter.',
  'Spaced repetition beats cramming. Return to topics across multiple days.',
  'Put your phone in another room while studying — even face-down cuts focus.',
];

const getDailyTip = () => AI_TIPS[new Date().getDate() % AI_TIPS.length];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const isToday = (iso) => {
  const d = new Date(iso), t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Stat = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] p-5 shadow-card animate-fade-up">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
      <Icon className="w-4 h-4" />
    </div>
    <p className="text-[26px] font-bold tracking-tight">{value}</p>
    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-48" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('campusflow_student_id');

  useEffect(() => {
    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([getStudent(studentId), getAllTasks()]);
        setStudent(sRes.data.data);
        setTasks(tRes.data.data.filter((t) => t.student_id === studentId));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [studentId]);

  if (loading) return <div className="p-6 lg:p-8"><Skeleton /></div>;

  const pending    = tasks.filter((t) => t.status === 'Pending');
  const completed  = tasks.filter((t) => t.status === 'Completed');
  const todayTasks = tasks.filter((t) => t.deadline && isToday(t.deadline));

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-5xl mx-auto lg:mx-0">

      {/* Greeting */}
      <div className="animate-fade-up">
        <h1 className="text-[24px] lg:text-[28px] font-bold tracking-tight">
          {getGreeting()}, {student?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[14px] mt-1">
          {student?.branch} · Year {student?.year} ·{' '}
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Total Tasks"  value={tasks.length}      icon={Layers}        accent="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" />
        <Stat label="Pending"      value={pending.length}    icon={Clock}         accent="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" />
        <Stat label="Completed"    value={completed.length}  icon={CheckCircle2}  accent="bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400" />
        <Stat label="Due Today"    value={todayTasks.length} icon={CalendarDays}  accent="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        {/* Pending tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[16px]">Pending Tasks</h2>
            <Link
              to="/tasks"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[13px] font-medium hover:gap-2 transition-all duration-150"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400">All caught up!</p>
              <p className="text-[12px] text-zinc-400 dark:text-zinc-500">No pending tasks right now.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.slice(0, 5).map((task, i) => (
                <div
                  key={task.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 group animate-fade-up"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{task.title}</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {task.subject && <span className="mr-1.5">{task.subject} ·</span>}
                      Due {fmtDate(task.deadline)}
                    </p>
                  </div>
                  <CalendarDays className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-3 animate-fade-up">

          {/* AI Tip */}
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 opacity-80" />
              <p className="text-[12px] font-semibold opacity-80 uppercase tracking-wider">AI Tip of the Day</p>
            </div>
            <p className="text-[13px] leading-relaxed opacity-95">{getDailyTip()}</p>
          </div>

          {/* Subjects */}
          {student?.subjects?.length > 0 && (
            <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-5">
              <h3 className="text-[13px] font-semibold mb-3 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Your Subjects</h3>
              <div className="flex flex-wrap gap-1.5">
                {student.subjects.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[12px] font-medium px-2.5 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due today alert */}
          {todayTasks.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-5">
              <p className="text-[13px] font-semibold text-red-700 dark:text-red-400 mb-2">⚠️ Due Today</p>
              {todayTasks.map((t) => (
                <p key={t.id} className="text-[12px] text-red-600 dark:text-red-400 font-medium mt-1">• {t.title}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
