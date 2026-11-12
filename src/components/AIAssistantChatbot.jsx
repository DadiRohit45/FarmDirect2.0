import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  X, 
  Send, 
  Minimize2, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Store, 
  Package, 
  LogIn, 
  ArrowUpRight 
} from 'lucide-react';
import { queryRAGAssistant } from '../lib/ragEngine';

function getFeatureIcon(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('customer') || u.includes('market') || u.includes('product')) return ShoppingCart;
  if (u.includes('farmer') || u.includes('harvest')) return Sprout;
  if (u.includes('rwbcis') || u.includes('insurance')) return ShieldCheck;
  if (u.includes('tracking') || u.includes('reefer')) return Truck;
  if (u.includes('kirana') || u.includes('hub')) return Store;
  if (u.includes('bulk')) return Package;
  if (u.includes('login') || u.includes('register') || u.includes('signin') || u.includes('signup')) return LogIn;
  return ArrowUpRight;
}

function renderInlineFormatting(text, isUser = false, onLinkClick = null) {
  if (!text) return null;
  const parts = [];
  // Tokenize bold, code, math, and markdown links [Label](url)
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\$[^\$]+\$|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push({ type: 'code', content: token.slice(1, -1) });
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push({ type: 'bold', content: token.slice(2, -2) });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      parts.push({ type: 'math', content: token.slice(1, -1) });
    } else if (token.startsWith('[') && token.includes('](')) {
      parts.push({
        type: 'link',
        content: match[2],
        url: match[3]
      });
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return parts.map((part, idx) => {
    if (part.type === 'bold') {
      return (
        <strong
          key={idx}
          className={isUser ? 'font-bold text-white' : 'font-semibold text-[#102F27]'}
        >
          {part.content}
        </strong>
      );
    }
    if (part.type === 'code') {
      return (
        <code
          key={idx}
          className={`font-mono px-1 py-0.5 rounded text-[11px] ${
            isUser
              ? 'bg-emerald-700/60 text-white'
              : 'bg-slate-200 text-[#185844] border border-slate-300/40'
          }`}
        >
          {part.content}
        </code>
      );
    }
    if (part.type === 'math') {
      return (
        <span
          key={idx}
          className={`font-mono px-1 py-0.5 rounded text-[11px] font-medium ${
            isUser
              ? 'bg-emerald-700/60 text-emerald-100'
              : 'bg-emerald-50 text-[#185844] border border-emerald-200'
          }`}
        >
          {part.content}
        </span>
      );
    }
    if (part.type === 'link') {
      const FeatureIcon = getFeatureIcon(part.url);
      const cleanLabel = part.content
        .replace(/^👉\s*/, '')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      return (
        <button
          key={idx}
          type="button"
          onClick={() => onLinkClick && onLinkClick(part.url)}
          className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-[#185844] hover:text-[#102F27] bg-[#185844]/10 hover:bg-[#185844]/20 border border-[#185844]/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs active:scale-[0.98] mx-0.5 my-1"
        >
          <FeatureIcon className="w-3.5 h-3.5 text-[#185844] shrink-0" />
          <span>{cleanLabel}</span>
          <ArrowUpRight className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      );
    }
    return <span key={idx}>{part.content}</span>;
  });
}

function renderTable(tableText, isUser, onLinkClick = null) {
  const lines = tableText.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return <pre className="font-mono text-[10px] overflow-x-auto">{tableText}</pre>;

  const parseRow = (line) => {
    const raw = line.split('|');
    if (raw.length > 2) {
      return raw.slice(1, -1).map(c => c.trim());
    }
    return raw.map(c => c.trim());
  };

  const headerCells = parseRow(lines[0]);
  const isSeparator = (line) => /^\|?\s*:?-+:?\s*(\|:?-+:?\s*)+\|?$/.test(line.trim());
  const dataLines = lines.slice(1).filter(l => !isSeparator(l));

  return (
    <div className="overflow-x-auto my-2 rounded-lg border border-slate-200 bg-white/80">
      <table className="w-full text-left text-[11px] border-collapse">
        <thead>
          <tr className="bg-emerald-50/80 border-b border-slate-200">
            {headerCells.map((h, i) => (
              <th key={i} className="px-2.5 py-1.5 font-semibold text-[#102F27]">
                {renderInlineFormatting(h, isUser, onLinkClick)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dataLines.map((rowLine, rIdx) => {
            const cells = parseRow(rowLine);
            return (
              <tr key={rIdx} className="hover:bg-slate-50/50">
                {cells.map((c, cIdx) => (
                  <td key={cIdx} className="px-2.5 py-1.5 text-slate-700">
                    {renderInlineFormatting(c, isUser, onLinkClick)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SystematicMessageBody({ text, isUser, onLinkClick = null }) {
  if (!text) return null;
  const blocks = text.split('\n\n').map(b => b.trim()).filter(Boolean);

  return (
    <div className="text-xs font-normal space-y-2 leading-relaxed">
      {blocks.map((block, bIdx) => {
        // Table format check
        if (block.startsWith('|') && block.includes('\n') && block.includes('|')) {
          return <div key={bIdx}>{renderTable(block, isUser, onLinkClick)}</div>;
        }

        // Heading 3
        if (block.startsWith('### ')) {
          const content = block.replace(/^###\s+/, '');
          return (
            <div
              key={bIdx}
              className={`font-bold text-[13px] pt-1 pb-1 border-b flex items-center gap-1.5 ${
                isUser
                  ? 'text-white border-emerald-500/40'
                  : 'text-[#102F27] border-emerald-200'
              }`}
            >
              <span>{renderInlineFormatting(content, isUser, onLinkClick)}</span>
            </div>
          );
        }

        // Heading 4
        if (block.startsWith('#### ')) {
          const content = block.replace(/^####\s+/, '');
          return (
            <div
              key={bIdx}
              className={`font-semibold text-xs pt-1 flex items-center gap-1.5 ${
                isUser ? 'text-emerald-100' : 'text-[#102F27]'
              }`}
            >
              {!isUser && <span className="w-1.5 h-1.5 rounded-full bg-[#185844] flex-shrink-0" />}
              <span>{renderInlineFormatting(content, isUser, onLinkClick)}</span>
            </div>
          );
        }

        // Blockquote
        if (block.startsWith('> ') || block.startsWith('>')) {
          const cleanQuote = block
            .split('\n')
            .map(l => l.replace(/^>\s?/, ''))
            .join(' ');
          return (
            <blockquote
              key={bIdx}
              className={`border-l-2 pl-2.5 pr-2 py-1.5 rounded-r text-[11px] my-1.5 ${
                isUser
                  ? 'border-emerald-300 bg-emerald-700/40 text-emerald-100'
                  : 'border-[#185844] bg-emerald-50/70 text-slate-700'
              }`}
            >
              {renderInlineFormatting(cleanQuote, isUser, onLinkClick)}
            </blockquote>
          );
        }

        // Bullet lists or numbered sequences
        const lines = block.split('\n');
        const hasListItems = lines.some(l => /^(\s*[-•*]|\s*\d+\.)\s+/.test(l));

        if (hasListItems) {
          return (
            <div key={bIdx} className="space-y-1 my-1">
              {lines.map((line, lIdx) => {
                const bulletMatch = line.match(/^(\s*[-•*]|\s*(\d+)\.)\s+(.*)$/);
                if (bulletMatch) {
                  const isNumbered = Boolean(bulletMatch[2]);
                  const itemContent = bulletMatch[3];
                  return (
                    <div key={lIdx} className="flex items-start gap-1.5 pl-1 text-[11.5px]">
                      {isNumbered ? (
                        <span
                          className={`text-[10px] font-bold font-mono px-1 rounded flex-shrink-0 mt-0.5 ${
                            isUser
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-100 text-[#185844]'
                          }`}
                        >
                          {bulletMatch[2]}
                        </span>
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            isUser ? 'bg-emerald-200' : 'bg-[#185844]'
                          }`}
                        />
                      )}
                      <span className="flex-1 leading-snug">
                        {renderInlineFormatting(itemContent, isUser, onLinkClick)}
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="text-[11.5px]">
                    {renderInlineFormatting(line, isUser, onLinkClick)}
                  </p>
                );
              })}
            </div>
          );
        }

        return (
          <p key={bIdx} className="text-[11.5px]">
            {renderInlineFormatting(block, isUser, onLinkClick)}
          </p>
        );
      })}
    </div>
  );
}

export default function AIAssistantChatbot({ currentUser, onNavigate, onOpenAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleLinkClick = (url) => {
    if (!url) return;
    if (url === '#login') {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (url === '#register' || url === '#signup') {
      if (onOpenAuth) onOpenAuth('register');
      return;
    }
    if (url.startsWith('#')) {
      const hash = url.toLowerCase();
      window.location.hash = hash;
      if (onNavigate) {
        if (hash === '#customer' || hash === '#market' || hash === '#products' || hash === '#bulk' || hash === '#anchor' || hash === '#services' || hash === '#tracking') {
          onNavigate('customer');
        } else if (hash === '#farmer' || hash === '#farmer-tracking' || hash === '#rwbcis' || hash === '#harvest') {
          onNavigate('farmer');
        } else if (hash === '#kirana' || hash === '#hub') {
          onNavigate('kirana');
        } else if (hash === '#home') {
          onNavigate('home');
        }
      }
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const initialMessages = [
    {
      id: 'welcome',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hi! How can I help you today?"
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isThinking]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    const textToSend = inputQuery.trim();
    if (!textToSend || isThinking) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await queryRAGAssistant(textToSend, currentUser?.role, false, { currentUser });
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Sprout Assistant error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'I encountered an issue processing your request. Please ask again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans print:hidden">
      {/* 1. FLOATING LAUNCHER PILL (When closed or minimized) */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#185844] hover:bg-[#102F27] text-[#F2EBDD] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border border-[#78947F]/40 cursor-pointer active:scale-95"
          aria-label="Open Sprout AI Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight">Sprout</div>
            <div className="text-[10px] text-[#F2EBDD]/80 leading-tight">Ask anything...</div>
          </div>
        </button>
      )}

      {/* 2. PLAIN SPROUT ASSISTANT WINDOW (When open) */}
      {isOpen && !isMinimized && (
        <div className="w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] flex flex-col bg-[#FAF6EF] border border-[#78947F]/40 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-xl relative">
          
          {/* Plain Header: Just "Sprout" and minimize/close */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#102F27] via-[#185844] to-[#102F27] text-[#F2EBDD] flex items-center justify-between border-b border-[#78947F]/30 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-[#F2EBDD]">Sprout</h3>
                <p className="text-[10px] text-[#78947F] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#F2EBDD]/80">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender badge */}
                <div className="flex items-center gap-1 mb-1 px-1 text-[10px] text-slate-500">
                  {msg.sender === 'bot' ? (
                    <>
                      <Sprout className="w-3 h-3 text-emerald-600" />
                      <span className="font-semibold text-[#185844]">Sprout</span>
                    </>
                  ) : (
                    <span className="font-semibold text-slate-600">{currentUser?.name || 'You'}</span>
                  )}
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#185844] text-white rounded-br-none'
                      : 'bg-white/90 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <SystematicMessageBody 
                    text={msg.text} 
                    isUser={msg.sender === 'user'} 
                    onLinkClick={handleLinkClick} 
                  />
                </div>
              </div>
            ))}

            {/* Thinking / Searching indicator */}
            {isThinking && (
              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center gap-1.5 px-1 text-[10px] text-[#185844] font-semibold">
                  <Sprout className="w-3 h-3 text-emerald-600 animate-spin" />
                  <span>Sprout is thinking…</span>
                </div>
                <div className="bg-white/90 border border-slate-200 rounded-xl rounded-bl-none px-3.5 py-2 flex items-center gap-1 shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#185844] opacity-50 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#185844] opacity-75 animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#185844] animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Search / Input Bar: Just the input and send button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#FAF6EF] border-t border-[#78947F]/30 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Sprout anything..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#F2EBDD] border border-[#78947F]/35 text-[#102F27] placeholder-[#78947F] focus:outline-none focus:ring-2 focus:ring-[#185844]/50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="p-2.5 rounded-xl bg-[#185844] hover:bg-[#23785F] disabled:opacity-40 disabled:cursor-not-allowed text-[#F2EBDD] shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
