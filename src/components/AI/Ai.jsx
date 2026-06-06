import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, ChevronDown, Atom, AlertCircle, RefreshCw } from 'lucide-react';

// ==================== API CONFIGURATION ====================
// Use relative URL in development (Vite proxy will forward to backend)
// In production, set VITE_API_BASE_URL environment variable.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const GEMINI_ENDPOINT = `${API_BASE}/api/gemini`;

// Simple health check
async function isBackendHealthy() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchAIResponse(messages, context = "") {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 100)}`);
  }
  
  const data = await response.json();
  return data.reply;
}

// ==================== Markdown helper ====================
const formatText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-cyan-700 dark:text-cyan-300">{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== part.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))}</span>;
  });
};

// ==================== Typing indicator ====================
const TypingIndicator = () => (
  <div className="flex space-x-1 p-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none w-16 shadow-sm border">
    {[0, 1, 2].map(dot => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-cyan-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
      />
    ))}
  </div>
);

// ==================== Chat bubble ====================
const ChatMessage = React.memo(({ msg }) => {
  const isUser = msg.role === 'user';
  const isError = msg.isError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-md flex-shrink-0 ${isError ? 'bg-red-500' : 'bg-gradient-to-br from-cyan-400 to-blue-600'}`}>
          {isError ? <AlertCircle size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>
      )}
      <div className={`max-w-[80%] p-3 text-sm md:text-base ${
        isUser
          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-none shadow-md'
          : isError 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-2xl rounded-tl-none shadow-sm border border-red-200'
            : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-2xl rounded-tl-none shadow-sm border'
      }`}>
        {formatText(msg.text)}
      </div>
    </motion.div>
  );
});

// ==================== Main component ====================
const AIAssistant = ({ context = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Lab Assistant. 🧬\n\nNeed help understanding the current experiment or any science concepts?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Check backend health once when opening
      isBackendHealthy().then(healthy => setConnectionError(!healthy));
    }
  }, [isOpen]);

  const handleSend = useCallback(async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping || disabled) return;

    // If we know backend is down, don't even try
    if (connectionError) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "⚠️ Cannot connect to the AI server. Please make sure the backend is running on port 8000.\n\nRun: `cd backend && uvicorn backend:app --reload --port 8000`",
        isError: true
      }]);
      return;
    }

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await fetchAIResponse([...messages, userMessage], context);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setConnectionError(false);
    } catch (err) {
      console.error("Chat Error:", err);
      setConnectionError(true);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `❌ Backend error: ${err.message}\n\nPlease verify:\n1. Backend is running on port 8000\n2. Your .env.local contains GEMINI_API_KEY\n3. The frontend proxy is configured (see vite.config.js)`,
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, isTyping, disabled, context, connectionError]);

  const quickPrompts = ["Explain DNA simply", "Lab safety tips", "What's a nucleus?"];

  if (disabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[90vw] md:w-[380px] h-[60vh] md:h-[650px] max-h-[80vh] bg-slate-50 dark:bg-zinc-900 rounded-3xl shadow-2xl border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-700 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Atom className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-cyan-700 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base">Lab Assistant</h3>
                  <p className="text-cyan-100 text-xs">
                    {connectionError ? "⚠️ Offline" : "Science Mentor AI"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Connection error banner */}
            {connectionError && (
              <div className="mx-4 mt-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-xs flex items-center justify-between">
                <span className="flex items-center gap-1"><AlertCircle size={14} /> Backend unreachable</span>
                <button onClick={() => window.location.reload()} className="underline flex items-center gap-1">
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {/* Chat history */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-zinc-900">
              {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && !isTyping && !connectionError && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full hover:bg-cyan-200 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-t shrink-0">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-full border focus-within:ring-2 focus-within:ring-cyan-500">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={connectionError ? "Backend offline – start the server" : "Ask a science question..."}
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm md:text-base"
                  disabled={isTyping || connectionError}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || connectionError}
                  className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Sparkles size={10} /> AI can make mistakes. Think critically!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30"></span>
          <Bot size={28} className="relative z-10" />
          {messages.length === 1 && !connectionError && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default AIAssistant;