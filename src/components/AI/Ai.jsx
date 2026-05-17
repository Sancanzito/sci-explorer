import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const genAI = new GoogleGenerativeAI('AIzaSyB1yCTSCtsmucFEQrpN01mK5XBRHY8o2ts');

const AIAssistant = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your SciHub AI Assistant. How can I help you with your science studies today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Signal status
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "You are a specialized Science Education Assistant. Format responses in clear paragraphs or lists. Always provide clickable links for references."
      });

      const result = await model.generateContent(inputMessage);
      const text = result.response.text();

      setMessages(prev => [...prev, { id: Date.now() + 1, text, sender: 'ai' }]);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      setMessages(prev => [...prev, { id: Date.now(), text: "⚠️ Connection lost. Check your API key or network.", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl text-white bg-cyan-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🤖
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              {/* Header with Connection Status */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-xl">🔬</div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  </div>
                  <div>
                    <h2 className="font-semibold leading-none">SciHub AI</h2>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{isConnected ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded-md">✕</button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none'
                    }`}>
                      {/* Markdown renders the links and paragraphs */}
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300" />,
                          p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                          ul: ({node, ...props}) => <ul {...props} className="list-disc ml-4 mb-2" />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700 bg-opacity-50">
                <div className="flex items-end gap-2 bg-gray-800 rounded-xl p-2 focus-within:ring-1 ring-cyan-500">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder="Ask about microbiology..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-1 max-h-32"
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg disabled:opacity-30 transition-all"
                  >
                    <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;