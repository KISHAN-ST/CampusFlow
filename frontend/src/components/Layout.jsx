import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Bell,
  BookOpen, LogOut, GraduationCap, Sun, Moon, Briefcase,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ChatBot from './ChatBot';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/tasks',      label: 'Tasks',      icon: CheckSquare },
  { to: '/notices',    label: 'Notices',    icon: Bell },
  { to: '/flashcards', label: 'Study',      icon: BookOpen },
  { to: '/placement',  label: 'Placement',  icon: Briefcase },
];

export default function Layout() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const studentName = localStorage.getItem('campusflow_student_name') || 'Student';

  const handleLogout = () => {
    localStorage.removeItem('campusflow_student_id');
    localStorage.removeItem('campusflow_student_name');
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7]">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[260px] bg-white dark:bg-[#1c1c1e] border-r border-black/[0.06] dark:border-white/[0.07] z-30">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[68px] border-b border-black/[0.06] dark:border-white/[0.07]">
          <div className="w-8 h-8 bg-blue-600 rounded-[10px] flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[15px] leading-none tracking-tight">CampusFlow</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Student Hub</p>
          </div>
        </div>

        {/* Student pill */}
        <div className="mx-4 mt-4 mb-2 px-3 py-2.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl">
          <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Signed in as</p>
          <p className="text-[13px] font-medium truncate">{studentName}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-black/[0.06] dark:border-white/[0.07] space-y-0.5">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-150"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Switch Student
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Header ───────────────────────────── */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 z-30 flex items-center justify-between px-5 glass-light dark:glass-dark border-b border-black/[0.06] dark:border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-[8px] flex items-center justify-center shrink-0">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CampusFlow</span>
        </div>
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-black/[0.06] dark:bg-white/[0.1] flex items-center justify-center transition-all duration-150 active:scale-90"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="lg:ml-[260px] pt-14 pb-[72px] lg:pt-0 lg:pb-0 min-h-screen">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Nav ───────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-[68px] z-30 flex items-center justify-around px-1 glass-light dark:glass-dark border-t border-black/[0.06] dark:border-white/[0.07]">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[9px] font-semibold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── AI ChatBot (always visible) ──────────────────── */}
      <ChatBot />
    </div>
  );
}
