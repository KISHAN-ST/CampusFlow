import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GraduationCap, Loader2, Moon, Sun } from 'lucide-react';
import { registerStudent } from '../api/student';
import { useTheme } from '../context/ThemeContext';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'AIDS', 'AIML'];
const YEARS    = [1, 2, 3, 4];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = `w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
  placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-4 py-3 text-[14px] font-medium
  outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 border-0`;

export default function Register() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', branch: 'CSE', year: '1',
    subjects: '', phone: '', gmail: '',
  });

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        year:     Number(form.year),
        subjects: form.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await registerStudent(payload);
      localStorage.setItem('campusflow_student_id',   data.data.id);
      localStorage.setItem('campusflow_student_name', data.data.name);
      toast.success(`Welcome to CampusFlow, ${data.data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black flex flex-col items-center justify-center p-5 transition-colors duration-300">

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="fixed top-5 right-5 w-9 h-9 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center transition-all active:scale-90"
      >
        {dark ? <Sun className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-500" />}
      </button>

      <div className="w-full max-w-[420px] animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-600/25">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">CampusFlow</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[14px] mt-1">AI × WhatsApp × Google Calendar</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-card border border-black/[0.06] dark:border-white/[0.07] p-7">
          <h2 className="text-[18px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-0.5">Create your profile</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mb-6">We'll send WhatsApp reminders to your number.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input
                required value={form.name} onChange={set('name')}
                placeholder="Kishan ST"
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Branch">
                <select value={form.branch} onChange={set('branch')} className={inputCls}>
                  {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Year">
                <select value={form.year} onChange={set('year')} className={inputCls}>
                  {YEARS.map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Subjects (comma separated)">
              <input
                value={form.subjects} onChange={set('subjects')}
                placeholder="Maths, OS, DBMS, CN"
                className={inputCls}
              />
            </Field>

            <Field label="WhatsApp Number">
              <input
                required value={form.phone} onChange={set('phone')}
                placeholder="+91 98765 43210"
                className={inputCls}
              />
            </Field>

            <Field label="Gmail">
              <input
                required type="email" value={form.gmail} onChange={set('gmail')}
                placeholder="you@gmail.com"
                className={inputCls}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.97] disabled:opacity-60 text-white font-semibold text-[15px] py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Setting up...' : 'Get Started'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-zinc-400 dark:text-zinc-600 mt-6">
          Your data stays on your device's local storage.
        </p>
      </div>
    </div>
  );
}
