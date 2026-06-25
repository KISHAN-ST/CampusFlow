import { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Loader2, Send, Sparkles, MessageSquare, CheckCheck } from 'lucide-react';
import { createNotice } from '../api/notice';

const inputCls = `w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
  placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-4 py-3 text-[14px] font-medium
  outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 border-0`;

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const HOW_IT_WORKS = [
  { icon: '✍️', text: 'You paste the notice title and content' },
  { icon: '🤖', text: 'Groq AI (LLaMA 3.3 70B) generates a 3-bullet summary' },
  { icon: '📅', text: 'n8n creates a Google Calendar event automatically' },
  { icon: '📲', text: 'All students receive the summary on WhatsApp' },
];

export default function Notices() {
  const [form, setForm]       = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await createNotice(form);
      setResult({ summary: data.data.summary, title: form.title });
      toast.success('Notice broadcast queued for all students 📲');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setForm({ title: '', content: '' }); setResult(null); };

  const bullets = result?.summary
    ? result.summary.split('\n').filter((l) => l.trim())
    : [];

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto lg:mx-0">

      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="text-[24px] lg:text-[28px] font-bold tracking-tight">Notice Summarizer</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mt-1">
          Paste a notice → AI summarizes → broadcasts to all students via WhatsApp.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Input */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-semibold text-[15px]">Post a Notice</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Notice Title">
              <input
                required value={form.title} onChange={set('title')}
                placeholder="Annual College Fest 2025"
                className={inputCls}
              />
            </Field>
            <Field label="Notice Content">
              <textarea
                required value={form.content} onChange={set('content')}
                placeholder="Paste the full notice text here — the more detail, the better the AI summary..."
                rows={9}
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </Field>

            <div className="flex gap-2.5">
              <button
                type="button" onClick={handleClear}
                className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-semibold py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors active:scale-[0.97]"
              >
                Clear
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-[14px] font-semibold py-3 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm shadow-blue-600/25"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  : <><Send className="w-4 h-4" /> Summarize &amp; Broadcast</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: '60ms' }}>

          {/* AI Summary card */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-6 min-h-[200px] flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <h2 className="font-semibold text-[15px]">AI Summary</h2>
              {result && (
                <span className="ml-auto text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                  Ready
                </span>
              )}
            </div>

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
                <p className="text-[13px] text-zinc-400 dark:text-zinc-500">Groq AI is reading the notice...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-[14px] font-medium text-zinc-400 dark:text-zinc-500">Summary appears here</p>
                <p className="text-[12px] text-zinc-300 dark:text-zinc-600">Submit a notice to see the AI output.</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-2.5 animate-fade-up">
                {bullets.length > 0 ? bullets.map((line, i) => (
                  <div key={i} className="flex items-start gap-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3.5">
                    <span className="w-5 h-5 bg-violet-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
                      {line.replace(/^[•\-*]\s*/, '')}
                    </p>
                  </div>
                )) : (
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">{result.summary}</p>
                )}
              </div>
            )}
          </div>

          {/* Broadcast status */}
          {result && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200/60 dark:border-green-900/50 rounded-2xl p-4 flex items-start gap-3 animate-fade-up">
              <CheckCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-green-800 dark:text-green-300">Broadcast Triggered</p>
                <p className="text-[12px] text-green-700 dark:text-green-400 mt-0.5">
                  n8n is sending the summary to all registered students via WhatsApp and creating a Calendar event.
                </p>
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-5">
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">How it works</p>
            <div className="space-y-2.5">
              {HOW_IT_WORKS.map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-base shrink-0">{icon}</span>
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
