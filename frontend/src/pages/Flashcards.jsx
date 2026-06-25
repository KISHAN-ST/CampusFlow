import { useState } from 'react';
import toast from 'react-hot-toast';
import { BookOpen, Loader2, RotateCcw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { flashcards as generateFlashcards } from '../api/ai';

const SAMPLE_NOTES = `Operating System is software that manages computer hardware and software resources.
Process is a program in execution. A process has its own memory space and resources.
Round Robin scheduling gives each process equal CPU time in a cyclic order.
Deadlock occurs when two or more processes wait for each other to release resources.
Virtual memory allows execution of processes not entirely in physical memory.
Semaphore is a synchronization tool used to solve critical section problems.
Paging divides memory into fixed-size pages to eliminate external fragmentation.`;

function FlipCard({ question, answer, index, total }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card h-52 cursor-pointer select-none ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped((p) => !p)}
    >
      <div className="flip-card-inner shadow-md hover:shadow-lg transition-shadow duration-200">
        {/* Front */}
        <div className="flip-card-front bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.07] flex flex-col items-center justify-center p-6 text-center">
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            Card {index + 1} of {total}
          </span>
          <p className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">{question}</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-4">Tap to reveal answer</p>
        </div>
        {/* Back */}
        <div className="flip-card-back bg-gradient-to-br from-blue-600 to-violet-600 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mb-3">Answer</span>
          <p className="text-[13px] text-white leading-relaxed font-medium">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Flashcards() {
  const [notes, setNotes]     = useState('');
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedAll, setFlippedAll] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setCards([]);
    try {
      const { data } = await generateFlashcards(notes);
      setCards(data.data.flashcards);
      toast.success(`${data.data.flashcards.length} flashcards ready! 🎴`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
    placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-4 py-3 text-[14px] font-medium
    outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-150 border-0 resize-none leading-relaxed`;

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto lg:mx-0">

      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="text-[24px] lg:text-[28px] font-bold tracking-tight">AI Study Buddy</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mt-1">
          Paste your lecture notes → Groq AI generates flashcards. Tap any card to flip it.
        </p>
      </div>

      {cards.length === 0 ? (
        /* Input state */
        <div className="max-w-2xl animate-fade-up">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-500" />
              </div>
              <h2 className="font-semibold text-[15px]">Paste Lecture Notes</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your lecture notes, textbook summaries, or any study material here. The AI will extract key concepts and create Q&A flashcards."
                rows={11}
                className={inputCls}
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setNotes(SAMPLE_NOTES)}
                  className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[14px] font-semibold py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors active:scale-[0.97]"
                >
                  Load Sample
                </button>
                <button
                  type="submit"
                  disabled={loading || !notes.trim()}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[14px] font-semibold py-3 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm shadow-violet-600/25"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                    : <><BookOpen className="w-4 h-4" /> Generate Flashcards</>
                  }
                </button>
              </div>

              {loading && (
                <p className="text-center text-[12px] text-zinc-400 dark:text-zinc-500 animate-pulse">
                  🤖 Groq LLaMA 3.3 70B is reading your notes...
                </p>
              )}
            </form>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-black/[0.06] dark:border-white/[0.07] shadow-card p-5">
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Tips for best results</p>
            <div className="space-y-2">
              {[
                '📄 Paste at least 5–10 sentences for meaningful flashcards',
                '🎯 Subject-specific notes work better than mixed content',
                '✏️ Include definitions, formulas, and key concepts',
              ].map((tip, i) => (
                <p key={i} className="text-[13px] text-zinc-500 dark:text-zinc-400">{tip}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Cards state */
        <div className="animate-fade-up">
          {/* Controls */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-[16px]">{cards.length} Flashcards</p>
              <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5">Tap any card to flip · Click again to flip back</p>
            </div>
            <button
              onClick={() => { setCards([]); setNotes(''); }}
              className="flex items-center gap-2 text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.07] px-3.5 py-2 rounded-xl shadow-card hover:shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Notes
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((card, i) => (
              <div key={i} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
                <FlipCard question={card.question} answer={card.answer} index={i} total={cards.length} />
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="mt-6 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-100 dark:border-violet-900/40 rounded-2xl p-4 text-center">
            <p className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
              💡 Come back tomorrow to review these cards — spaced repetition boosts retention by 80%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
