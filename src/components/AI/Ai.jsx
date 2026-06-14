import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Terminal, Send, X, AlertTriangle, GripVertical, SquareTerminal, Minimize2 } from 'lucide-react';

// ==================== LOCAL AI CONFIGURATION ====================
// Initialize Gemini directly in the frontend for local, standalone execution.
// Ensure VITE_GEMINI_API_KEY is present in your .env or .env.local file.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6JD3GOBHO4BA24V0GjbJYWlOJsHDtICJHVdvP46l3Wdkw';
const genAI = new GoogleGenerativeAI(API_KEY);

// ==================== Markdown helper ====================
const formatText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-black dark:text-white">{part.slice(2, -2)}</strong>;
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
  <div className="flex space-x-2 p-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 w-24">
    {[0, 1, 2].map(dot => (
      <motion.div
        key={dot}
        className="w-1.5 h-1.5 bg-blue-600 rounded-none"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1, delay: dot * 0.2 }}
      />
    ))}
  </div>
);

// ==================== Chat bubble ====================
const ChatMessage = React.memo(({ msg }) => {
  const isUser = msg.role === 'user';
  const isError = msg.isError;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${isError ? 'text-red-500' : 'text-black/50 dark:text-white/50'}`}>
          {isUser ? 'USER INPUT' : isError ? 'SYSTEM ERROR' : 'AI RESPONSE'}
        </span>
      </div>
      <div className={`max-w-[85%] p-4 text-sm leading-relaxed border ${
        isUser
          ? 'bg-blue-600 text-white border-blue-600'
          : isError 
            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
            : 'bg-white dark:bg-[#09090B] text-black dark:text-white border-black/10 dark:border-white/10'
      }`}>
        {formatText(msg.text)}
      </div>
    </div>
  );
});

// ==================== Main component ====================
const AIAssistant = ({ context = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "SYSTEM INITIALIZED.\nHow may I assist with your scientific inquiry today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null); // Ref for drag constraints

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Global Keyboard Shortcut to unhide/toggle the widget (Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsHidden((prev) => {
          if (prev) setIsOpen(true); // Auto-open if we are unhiding
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = useCallback(async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    if (!API_KEY) {
      setMessages(prev => [...prev, 
        { role: 'user', text: trimmed },
        {
          role: 'ai',
          text: "CRITICAL FAILURE: VITE_GEMINI_API_KEY is missing from your environment variables. Local AI execution disabled.",
          isError: true
        }
      ]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Format history for Gemini SDK
      const history = messages
        .filter(m => !m.isError && m.text.trim() !== "") // exclude errors
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      // Inject strict context invisibly
      const systemInstruction = "You are a stark, precise laboratory AI. Answer questions directly, factually, and concisely. No emojis. " + context;
      
      const chat = model.startChat({
      history: history.slice(1), // Skip the hardcoded greeting to avoid conflicts
      systemInstruction: {
      parts: [{ text: systemInstruction }]
  },  
});
      const result = await chat.sendMessage(trimmed);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `EXECUTION ERROR: ${err.message}`,
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, isTyping, context]);

  const quickPrompts = ["Explain thermodynamics", "Standard laboratory protocols", "Define stoichiometry"];

  // Completely unmount if hidden
  if (isHidden) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      
      {/* --- DRAGGABLE CONTROLLER PILL --- */}
      {!isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={containerRef}
          className="absolute bottom-8 right-8 pointer-events-auto flex items-stretch bg-white dark:bg-[#09090B] border border-black/10 dark:border-white/10 shadow-2xl"
        >
          {/* Drag Handle */}
          <div className="flex items-center justify-center px-2 cursor-grab active:cursor-grabbing border-r border-black/10 dark:border-white/10 text-black/30 dark:text-white/30 hover:text-blue-600 transition-colors bg-black/5 dark:bg-white/5">
            <GripVertical size={16} />
          </div>
          
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:text-blue-600 transition-colors group"
          >
            <SquareTerminal size={16} className="text-blue-600" />
            <span>AI Console</span>
          </button>
          
          {/* Hide Button */}
          <button
            onClick={() => setIsHidden(true)}
            className="flex items-center justify-center px-4 border-l border-black/10 dark:border-white/10 text-black/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Hide Component (Ctrl + / to restore)"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </motion.div>
      )}

      {/* --- MAIN CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-6 pointer-events-auto w-[90vw] md:w-[450px] h-[75vh] md:h-[700px] max-h-[85vh] bg-white dark:bg-[#09090B] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-black dark:text-white">
                <Terminal size={18} className="text-blue-600" />
                <div className="flex flex-col">
                  <h3 className="font-mono text-xs font-bold tracking-widest uppercase">Sci-Explorer AI</h3>
                  <span className="font-mono text-[10px] text-black/50 dark:text-white/50 tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-none inline-block"></span> Local Compute
                  </span>
                </div>
              </div>
              <div className="flex items-center border border-black/10 dark:border-white/10">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-r border-black/10 dark:border-white/10"
                  title="Minimize"
                >
                  <Minimize2 size={16} />
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setIsHidden(true); }} 
                  className="p-2 text-black/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Terminate Console (Ctrl + / to restore)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Error Banner for Missing Key */}
            {!API_KEY && (
              <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30 flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="font-mono text-xs text-red-600 dark:text-red-400">
                  <span className="font-bold uppercase tracking-widest block mb-1">Configuration Required</span>
                  Add <code className="bg-red-500/20 px-1 py-0.5">VITE_GEMINI_API_KEY</code> to your environment file to enable local processing.
                </div>
              </div>
            )}

            {/* Chat history */}
            <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-[#09090B]">
              {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && !isTyping && API_KEY && (
              <div className="px-6 pb-4 flex flex-wrap gap-2 shrink-0 border-t border-black/5 dark:border-white/5 pt-4">
                <span className="w-full font-mono text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest mb-1">Suggested Queries</span>
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="font-mono text-xs px-3 py-2 border border-black/10 dark:border-white/10 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 text-black/70 dark:text-white/70 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-black/10 dark:border-white/10 shrink-0 bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="font-mono text-blue-600 text-sm font-bold pl-2">{">"}</div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Enter query..."
                  className="flex-1 bg-transparent px-2 py-2 outline-none text-sm font-mono text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                  disabled={isTyping || !API_KEY}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || !API_KEY}
                  className="p-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;