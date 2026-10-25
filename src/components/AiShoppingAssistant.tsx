import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Sparkles, X, Send, Bot, User, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendedProductIds?: string[];
  isAiLive?: boolean;
}

export const AiShoppingAssistant: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    products,
    openProductDetail,
    formatPrice
  } = useStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Salam and welcome to NovaCart AI. I am your personal styling concierge, grounded directly in our live catalogue. I can assist you with sizing guidelines, fabric specifications, occasion styling, or our Cash on Delivery policy.',
      isAiLive: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const quickPrompts = [
    'What do you recommend for a contemporary formal dinner?',
    'Do you have pure raw silk pret under Rs. 25,000?',
    'What is your Cash on Delivery and exchange policy?',
    'Help me choose matching accessories for ivory outfits'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'I am ready to help you discover the perfect ensemble.',
        recommendedProductIds: data.recommendedProductIds || [],
        isAiLive: data.isAiLive
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          text: 'We deliver nationwide across Pakistan within 24-48 hours with Cash on Delivery. For custom styling advice, please browse our catalogue or speak with our support desk.',
          isAiLive: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#FAF8F5] shadow-2xl border-l border-[#E7E2DA] flex flex-col justify-between animate-fadeIn">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#E7E2DA] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#B89758]/15 text-[#B89758] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Fashion Stylist</h3>
            <p className="text-[11px] text-[#7A7875]">Grounded in Live Store Inventory & Policies</p>
          </div>
        </div>

        <button
          onClick={() => setIsAssistantOpen(false)}
          className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F] rounded-full hover:bg-[#F3EFEA] transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#F4F1EA] px-4 py-2 border-b border-[#E7E2DA] text-[11px] text-[#6B6864] flex items-center justify-between">
        <span>Curator Mode: Catalog Invariants Active</span>
        <span className="font-mono text-[10px] text-[#B89758] font-semibold">Rule-Based Assistant</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const recProducts = m.recommendedProductIds
            ? products.filter((p) => m.recommendedProductIds?.includes(p.id))
            : [];

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#1C1C1F] text-[#FAF8F5] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#1C1C1F] text-white rounded-br-sm'
                      : 'bg-white text-[#2C2A29] border border-[#E7E2DA] shadow-2xl rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Grounded Recommended Product Cards */}
                {recProducts.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A7D6B] font-semibold">
                      Referenced Designs
                    </p>
                    {recProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          openProductDetail(p.id);
                          setIsAssistantOpen(false);
                        }}
                        className="cursor-pointer p-2 rounded-lg bg-white border border-[#E7E2DA] hover:border-[#1C1C1F] transition-all flex items-center justify-between gap-3 shadow-2xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-12 object-cover rounded bg-[#F3EFEA]"
                          />
                          <div>
                            <p className="text-xs font-medium text-[#1C1C1F] line-clamp-1">{p.name}</p>
                            <p className="font-mono text-[11px] text-[#7A7875] tabular-nums">
                              {formatPrice(p.salePrice || p.price)} · {p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#7A7875] shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-[#DDD7CE] text-[#4A4845] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-[#7A7875]">
            <div className="w-7 h-7 rounded-full bg-[#1C1C1F] text-[#FAF8F5] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E7E2DA] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B89758]" />
              <span>Analyzing live catalogue records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-[#F5F2EB] border-t border-[#E7E2DA] overflow-x-auto">
        <div className="flex gap-2 text-[11px]">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white border border-[#DDD7CE] hover:border-[#1C1C1F] text-[#4A4845] rounded-full whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-[#E7E2DA]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fabrics, styling, or delivery..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#1C1C1F] text-white rounded-lg hover:bg-[#2D2D32] transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-[#8A857D]">
          <span>Grounded in NovaCart AI product database</span>
          <button
            onClick={() => handleSend('I would like to speak to a human customer representative.')}
            className="underline hover:text-[#1C1C1F] flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Human Handoff</span>
          </button>
        </div>
      </div>
    </div>
  );
};
