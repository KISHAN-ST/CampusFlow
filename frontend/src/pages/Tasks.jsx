import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, CheckCircle2, Clock, Loader2, X, CalendarDays, ListTodo } from 'lucide-react';
import { createTask, getAllTasks, updateTask, deleteTask } from '../api/task';

const studentId = localStorage.getItem('campusflow_student_id');

const inputCls = `w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
  placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-4 py-3 text-[14px] font-medium
  outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 border-0`;

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const StatusBadge = ({ status }) =>
  status === 'Completed' ? (
    <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Done
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );

const fmtDeadline = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const EMPTY = { title: '', subject: '', description: '', deadline: '', reminderTime: '', calendar: false };

export default function Tasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [submitting, setSub]  = useState(false);

  const load = async () => {
    try {
      const { data } = await getAllTasks();
      setTasks(data.data.filter((t) => t.student_id === studentId));
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const set = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      const payload = {
        ...form,
        deadline:     form.deadline     ? new Date(form.deadline).toISOString()     : form.deadline,
        reminderTime: form.reminderTime ? new Date(form.reminderTime).toISOString() : form.reminderTime,
        studentId,
      };
      await createTask(payload);
      toast.success('Task created — WhatsApp reminder queued 📲');
      setModal(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally { setSub(false); }
  };

  const handleComplete = async (id) => {
    try {
      await updateTask(id, { status: 'Completed' });
      toast.success('Marked as completed ✅');
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const pending   = tasks.filter((t) => t.status === 'Pending');
  const completed = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto lg:mx-0">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="text-[24px] lg:text-[28px] font-bold tracking-tight">Tasks</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mt-1">
            Every task triggers a WhatsApp reminder via n8n.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.96] text-white text-[14px] font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-blue-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white dark:bg-[#1c1c1e] rounded-2xl animate-pulse border border-black/[0.06] dark:border-white/[0.07]" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-16 text-center animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-7 h-7 text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="font-semibold text-zinc-500 dark:text-zinc-400">No tasks yet</p>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-1">Add your first deadline to get started.</p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Pending · {pending.length}
              </p>
              <div className="space-y-2">
                {pending.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    delay={i * 50}
                    onComplete={() => handleComplete(task.id)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Completed · {completed.length}
              </p>
              <div className="space-y-2">
                {completed.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    delay={i * 50}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white dark:bg-[#1c1c1e] w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-modal border border-black/[0.06] dark:border-white/[0.07] animate-scale-in">

            {/* Handle (mobile) */}
            <div className="sm:hidden w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-1" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.07]">
              <h2 className="font-semibold text-[16px]">New Task</h2>
              <button
                onClick={() => setModal(false)}
                className="w-7 h-7 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <Field label="Title">
                <input required value={form.title} onChange={set('title')} placeholder="Submit Assignment" className={inputCls} />
              </Field>
              <Field label="Subject">
                <input value={form.subject} onChange={set('subject')} placeholder="Maths" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description} onChange={set('description')}
                  placeholder="Optional notes..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <Field label="Deadline">
                <input required type="datetime-local" value={form.deadline} onChange={set('deadline')} className={inputCls} />
              </Field>
              <Field label="WhatsApp Reminder Time">
                <input type="datetime-local" value={form.reminderTime} onChange={set('reminderTime')} className={inputCls} />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${form.calendar ? 'bg-blue-600 border-blue-600' : 'border-zinc-300 dark:border-zinc-600'}`}>
                  {form.calendar && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" checked={form.calendar} onChange={set('calendar')} className="sr-only" />
                <span className="text-[14px] font-medium">Add to Google Calendar</span>
              </label>

              <div className="flex gap-3 pt-1">
                <button
                  type="button" onClick={() => setModal(false)}
                  className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] text-[14px] font-semibold py-3 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-[14px] font-semibold py-3 rounded-xl transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, delay, onComplete, onDelete }) {
  const fmtDeadline = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const isOverdue = task.status === 'Pending' && new Date(task.deadline) < new Date();

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="group bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-4 flex items-start gap-4 hover:shadow-md transition-all duration-200 animate-fade-up"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className={`text-[14px] font-semibold ${task.status === 'Completed' ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
            {task.title}
          </p>
          {task.subject && (
            <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              {task.subject}
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mb-1.5">{task.description}</p>
        )}
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3 text-zinc-400" />
          <p className={`text-[11px] font-medium ${isOverdue ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
            {isOverdue ? '⚠ Overdue · ' : ''}{fmtDeadline(task.deadline)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {task.status === 'Pending' && onComplete && (
          <button
            onClick={onComplete}
            className="flex items-center gap-1 text-[12px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-950 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </button>
        )}
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center justify-center transition-all active:scale-90"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
