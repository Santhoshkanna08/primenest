import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minimize2,
  Trash2,
  Send,
  MessageCircle,
  PhoneCall,
  Bot,
  RotateCw
} from 'lucide-react';
import { Property } from '../../types/property';
import { siteConfig } from '../../data/config';
import { ChatCard } from './ChatCard';
import {
  ChatMessage,
  INITIAL_MESSAGE,
  sendChatMessage
} from '../../services/chatService';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProperty: (property: Property) => void;
  onOpenEnquiry: (property?: Property) => void;
  onScheduleSiteVisit: (property: Property) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  onViewProperty,
  onOpenEnquiry,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('primenest_chat_history');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [INITIAL_MESSAGE];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save session chat history
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('primenest_chat_history', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Scroll to bottom on new message or live streaming token
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, streamingText, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setLastFailedMessage(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const response = await sendChatMessage(
        [...messages, userMsg],
        trimmed,
        {
          onProgress: (partial) => {
            setStreamingText(partial);
          }
        }
      );

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        properties: response.matchedProperties,
        quickReplies: response.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setStreamingText('');
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setStreamingText('');
      setLastFailedMessage(trimmed);
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but our advisory connection experienced a momentary delay. You can retry your request below, or connect directly with our advisory desk on WhatsApp.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['Talk to an Agent', 'Explore Properties']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setStreamingText('');
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem('primenest_chat_history');
    setLastFailedMessage(null);
  };

  const getRecentPropertyContext = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.properties && msg.properties.length > 0) {
        return msg.properties[0];
      }
    }
    return null;
  };

  const handleQuickReply = (reply: string) => {
    if (isTyping) return;
    if (reply === 'Talk to an Agent') {
      handleSendMessage('Can I talk to an agent?');
    } else if (reply === 'Arrange a Site Visit') {
      handleSendMessage('I want to arrange a site visit.');
    } else if (reply === 'Enquire on WhatsApp') {
      const prop = getRecentPropertyContext();
      const url = prop
        ? siteConfig.buildPropertyWhatsAppUrl(prop.title, prop.refCode)
        : siteConfig.buildChatbotHandoffWhatsAppUrl();
      window.open(url, '_blank');
    } else {
      handleSendMessage(reply);
    }
  };

  // Render markdown-like text with bolding and markdown links cleanly
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;
          
          const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
          const parts = line.split(tokenRegex);

          return (
            <p key={idx} className="break-words">
              {parts.map((p, pIdx) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return <strong key={pIdx} className="font-semibold text-slate-900">{p.slice(2, -2)}</strong>;
                }
                const linkMatch = p.match(/^\[(.*?)\]\((.*?)\)$/);
                if (linkMatch) {
                  const label = linkMatch[1];
                  const href = linkMatch[2];
                  const isExternal = href.startsWith('http') || href.startsWith('https://wa.me');
                  return (
                    <a
                      key={pIdx}
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="font-semibold text-[#172720] underline hover:text-[#B69A70] transition-colors"
                    >
                      {label}
                    </a>
                  );
                }
                return p;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="PrimeNest Assistant Chat Panel"
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isMinimized
          ? 'bottom-4 right-3 sm:bottom-6 sm:right-6 w-[min(280px,calc(100vw-1.5rem))] h-14 bg-[#172720] rounded-xl border border-[#B69A70]/40 overflow-hidden'
          : 'inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 w-auto sm:w-[420px] h-[min(620px,calc(100dvh-1rem))] sm:h-[580px] bg-[#F7F5EF] rounded-2xl border border-[#E7DCC7] flex flex-col overflow-hidden'
      }`}
    >
      {/* Minimized Bar */}
      {isMinimized ? (
        <div
          onClick={() => setIsMinimized(false)}
          className="w-full h-full px-4 flex items-center justify-between text-white cursor-pointer hover:bg-[#202B25] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#B69A70]" />
            <span className="text-xs font-serif font-semibold">PrimeNest Assistant</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:text-[#B69A70]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-[#172720] text-white p-4 flex items-center justify-between border-b border-[#E7DCC7]/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#202B25] border border-[#B69A70]/40 flex items-center justify-center text-[#B69A70]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-semibold tracking-wide text-white leading-tight">
                  PrimeNest Assistant
                </h3>
                <p className="text-[10px] text-[#E7DCC7]/75 font-mono leading-tight">
                  Your property search starts here.
                </p>
              </div>
            </div>

            {/* Header controls: Clear, Minimize, Close */}
            <div className="flex items-center gap-1 text-[#E7DCC7]/70">
              <button
                type="button"
                onClick={handleClearHistory}
                aria-label="Clear chat history"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                aria-label="Minimize chat panel"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat panel"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation History Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#F7F5EF]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#172720] text-white rounded-br-none'
                      : 'bg-white text-[#202B25] border border-[#E7DCC7] rounded-bl-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}

                  {/* Render Grounded Property Cards if included */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E7DCC7]/60 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#B69A70] block font-semibold">
                        Matching Curated Listings ({msg.properties.length}):
                      </span>
                      <div className="space-y-2">
                        {msg.properties.map((prop) => (
                          <ChatCard
                            key={prop.id}
                            property={prop}
                            onViewDetails={onViewProperty}
                            onEnquire={onOpenEnquiry}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Timestamp */}
                  <div
                    className={`mt-1.5 text-[9px] font-mono text-right ${
                      msg.role === 'user' ? 'text-[#E7DCC7]/60' : 'text-[#777B75]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Quick Reply Suggestions */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => handleQuickReply(qr)}
                        disabled={isTyping}
                        className="text-[11px] font-medium bg-white hover:bg-[#E7DCC7]/60 text-[#172720] border border-[#E7DCC7] px-2.5 py-1 rounded-full shadow-2xs hover:border-[#B69A70] transition-colors disabled:opacity-50"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Live Streaming Token Output */}
            {isTyping && streamingText && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="max-w-[85%] rounded-2xl p-3.5 shadow-sm bg-white text-[#202B25] border border-[#E7DCC7] rounded-bl-none">
                  {renderMessageContent(streamingText)}
                  <span className="inline-block w-1.5 h-3.5 bg-[#B69A70] ml-1 animate-pulse align-middle" />
                </div>
              </div>
            )}

            {/* Fast Typing Indicator (Before First Token Arrives) */}
            {isTyping && !streamingText && (
              <div className="flex items-center gap-2 text-xs text-[#777B75] bg-white p-3 rounded-2xl rounded-bl-none border border-[#E7DCC7] w-fit shadow-xs animate-pulse">
                <Bot className="w-3.5 h-3.5 text-[#B69A70] animate-spin" />
                <span className="font-mono text-[11px]">Consulting PrimeNest catalog...</span>
                <span className="inline-flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-[#B69A70] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#B69A70] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#B69A70] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}

            {/* Retry Button if last message failed */}
            {lastFailedMessage && !isTyping && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendMessage(lastFailedMessage)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#B69A70] hover:text-[#172720] bg-white border border-[#B69A70]/60 px-3 py-1.5 rounded-full font-medium shadow-2xs hover:bg-[#E7DCC7]/40 transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry Question</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Handoff Banner */}
          <div className="px-4 py-2 bg-[#E7DCC7]/30 border-t border-[#E7DCC7] flex items-center justify-between text-[11px] text-[#172720]">
            <span className="font-mono text-[10px] text-[#777B75] uppercase">
              HUMAN DESK
            </span>
            <div className="flex items-center gap-2">
              <a
                href={(() => {
                  const prop = getRecentPropertyContext();
                  return prop
                    ? siteConfig.buildPropertyWhatsAppUrl(prop.title, prop.refCode)
                    : siteConfig.buildChatbotHandoffWhatsAppUrl();
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#B69A70] font-semibold flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
              <span>·</span>
              <a
                href={`tel:${siteConfig.contact.phoneTel}`}
                className="hover:text-[#B69A70] font-semibold flex items-center gap-1 font-mono"
              >
                <PhoneCall className="w-3 h-3 text-[#B69A70]" />
                <span>Call ({siteConfig.contact.phoneDisplay})</span>
              </a>
            </div>
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-[#E7DCC7] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about plots, budget, or arrange a visit..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="flex-grow min-w-0 px-3 py-2 text-xs bg-[#F7F5EF] border border-[#E7DCC7] rounded-lg focus:outline-none focus:border-[#B69A70] text-[#172720] disabled:opacity-70"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="p-2.5 bg-[#172720] hover:bg-[#B69A70] text-white hover:text-[#172720] rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-[#172720] disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
