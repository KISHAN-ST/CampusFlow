import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User } from 'lucide-react';
import { chatWithAI } from '../api/ai';

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm CampusAI 👋 Ask me anything — study concepts, research help, how to use CampusFlow, or anything academic!",
};

const SUGGESTIONS = [
  'Explain recursion with an example',
  'How do I use the flashcards feature?',
  'What is time complexity?',
  'Tips for technical interviews',
];

export default function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTts]    = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const recognRef  = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Cleanup recognition on unmount
  useEffect(() => () => { recognRef.current?.abort(); }, []);

  // ── Text-to-speech ────────────────────────────────────
  const speak = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.lang = 'en-US';
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => window.speechSynthesis?.cancel();

  // ── Voice input ───────────────────────────────────────
  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Voice input is not supported in this browser. Try Chrome.');

    if (listening) {
      recognRef.current?.stop();
      setListening(false);
      return;
    }

    const recog = new SR();
    recognRef.current = recog;
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = () => setListening(false);
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after voice input
      setTimeout(() => sendMessage(transcript), 300);
    };

    recog.start();
  };

  // ── Send message ──────────────────────────────────────
  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput('');
    const userMsg = { role: 'user', content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Send only the last 10 messages to keep context manageable
      const context = updated.slice(-10).map(({ role, content }) => ({ role, content }));
      const { data } = await chatWithAI(context);
      const reply = data.data.reply;
      setMessages((p) => [...p, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: "Sorry, I couldn't connect. Please check if the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([WELCOME]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`fixed bottom-[84px] lg:bottom-6 right-4 lg:right-6 z-40 w-14 h-14 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all duration-200 active:scale-90 ${
          open ? 'bg-zinc-700 dark:bg-zinc-600 rotate-0' : 'bg-blue-600 hover:bg-blue-500'
        }`}
        aria-label="Open AI Chat"
      >
        {open
          ? <X className="w-6 h-6 text-white" />
          : <MessageCircle className="w-6 h-6 text-white" />
        }
        {!open && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-[160px] lg:bottom-[90px] right-4 lg:right-6 z-40 w-[92vw] max-w-[380px] animate-scale-in">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-modal border border-black/[0.06] dark:border-white/[0.07] flex flex-col overflow-hidden h-[480px]">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.07] shrink-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px]">CampusAI</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Powered by Groq · LLaMA 3.3 70B</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setTts((p) => !p); if (ttsEnabled) stopSpeaking(); }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ttsEnabled ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                  title={ttsEnabled ? 'Disable voice output' : 'Enable voice output'}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-[11px] font-bold"
                  title="Clear chat"
                >
                  ↺
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`flex gap-2.5 animate-fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-[#f5f5f7] dark:bg-[#2c2c2e]'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    }
                  </div>
                  <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.role === 'assistant' && ttsEnabled && (
                      <button onClick={() => speak(msg.content)} className="block mt-1.5 text-[10px] opacity-60 hover:opacity-100 transition-opacity">
                        🔊 Read aloud
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Suggestions — show only after welcome */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-black/[0.06] dark:border-white/[0.07] shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={listening ? '🎤 Listening...' : 'Ask anything...'}
                  rows={1}
                  className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none border-0 max-h-24 leading-relaxed"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                  }}
                />
                <button
                  onClick={toggleVoice}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                    listening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                  }`}
                  title="Voice input"
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 active:scale-90"
                >
                  {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                </button>
              </div>
              <p className="text-[10px] text-zinc-300 dark:text-zinc-600 text-center mt-2">
                Enter to send · Shift+Enter for new line · 🎤 for voice
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
