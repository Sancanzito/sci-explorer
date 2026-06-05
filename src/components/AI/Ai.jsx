// components/AIAssistant/AIAssistant.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, ChevronDown, Atom } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- SYSTEM PROMPT (EDUCATIONAL GUARDRAILS) ---
const SYSTEM_PROMPT = `
You are a science laboratory learning assistant for middle school students.

Rules:
- Never directly answer quizzes or exams.
- Guide students step-by-step.
- Encourage critical thinking.
- Give hints instead of answers.
- Explain science concepts simply.
- Use encouraging educational language.
- Keep responses relatively brief and conversational.
`;
//api key for google gen ai - replace with your own key
// Helper to get API key across different environments
const getApiKey = () => {
  // Create React App (CRA) / Webpack
  if (typeof process !== 'undefined' && process.env?.REACT_APP_GEMINI_API_KEY) {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }
  // Vite
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  // Next.js (client‑side)
  if (typeof window !== 'undefined' && window._env_?.REACT_APP_GEMINI_API_KEY) {
    return window._env_.REACT_APP_GEMINI_API_KEY;
  }
  // Fallback: hardcoded for development only (not recommended for production)
  console.error(
    'Gemini API key not found. ' +
    'Set REACT_APP_GEMINI_API_KEY (CRA), VITE_GEMINI_API_KEY (Vite), ' +
    'or NEXT_PUBLIC_GEMINI_API_KEY (Next.js).'
  );
  return '';
};

const API_KEY = getApiKey();

const MODEL_NAMES = ['gemini-2.5-flash'];

const genAI = new GoogleGenerativeAI(API_KEY);

async function fetchAIResponse(messages, context = "") {
  let lastError = null;
  let hitRateLimit = false; // Flag to track if ANY model hits a rate limit

  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_PROMPT
      });

      // Gemini requires history to START with a 'user' message.
      // We slice from index 1 to ignore the hardcoded AI greeting at index 0.
      const validHistory = messages.slice(1, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const chat = model.startChat({ history: validHistory });

      let userMessage = messages[messages.length - 1].text;
      if (context) {
        userMessage = `[System Note: The student is currently in the "${context}" section. Provide hints related to this context if relevant.]\n\nStudent says: ${userMessage}`;
      }

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      if (text) return text;
      
    } catch (err) {
      console.warn(`Model ${modelName} failed:`, err);
      lastError = err;
      
      // Check for rate limit and flag it so it isn't overwritten by subsequent 404s
      if (err?.message?.includes('429')) {
        hitRateLimit = true;
      }
    }
  }

  // All models failed - handle errors in order of priority
  if (lastError?.message?.includes('API key') || lastError?.message?.includes('API_KEY_INVALID')) {
    return "🔐 Invalid API key. Please check your configuration.";
  }
  
  if (hitRateLimit) {
    return "🕒 The lab is very busy right now. Please wait a moment and try again.";
  }
  
  return "💡 I'm having trouble connecting to my knowledge base. Please check your internet connection or model availability.";
}

// --- UTILITY: SIMPLE MARKDOWN RENDERER ---
const formatText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-cyan-700 dark:text-cyan-300">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== part.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))}</span>;
  });
};

// --- TYPING INDICATOR ---
const TypingIndicator = () => (
  <div className="flex space-x-1 p-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none w-16 shadow-sm border border-slate-200 dark:border-zinc-700/50">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 bg-cyan-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
      />
    ))}
  </div>
);

// --- CHAT MESSAGE BUBBLE ---
const ChatMessage = React.memo(({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mr-2 shadow-md flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] p-3 text-sm md:text-base ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-none shadow-md'
            : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-zinc-700/50'
        }`}
      >
        {formatText(msg.text)}
      </div>
    </motion.div>
  );
});

// --- MAIN AI ASSISTANT COMPONENT ---
const AIAssistant = ({ context = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Lab Assistant. 🧬\n\nNeed help understanding the current experiment or any science concepts?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping || disabled) return;

    const newMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await fetchAIResponse(newMessages, context);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Sorry, I encountered an unexpected error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, isTyping, disabled, context]);

  const quickPrompts = [
    "Explain DNA simply",
    "Lab safety tips",
    "What's a nucleus?"
  ];

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
            className="mb-4 w-[90vw] md:w-[380px] h-[60vh] md:h-[650px] max-h-[80vh] bg-slate-50 dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden backdrop-blur-xl dark:bg-opacity-95"
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
                  <p className="text-cyan-100 text-xs">Science Mentor AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-zinc-900">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800/50 transition border border-cyan-200 dark:border-cyan-800/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-700/50 shrink-0">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-full border border-slate-300 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-cyan-500 transition-shadow">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a science question..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 dark:text-zinc-200 text-sm md:text-base"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                <Sparkles size={10} /> AI can make mistakes. Think critically!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30 group-hover:opacity-50"></span>
          <Bot size={28} className="relative z-10" />
          
          {messages.length === 1 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-zinc-900"></span>
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default AIAssistant;