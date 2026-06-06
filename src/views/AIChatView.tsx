import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  Trash2, 
  DollarSign, 
  AlertTriangle, 
  Layers, 
  TrendingUp,
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';
import { ChatMessage, Project, Transaction } from '../types';

interface AIChatViewProps {
  project: Project;
  transactions: Transaction[];
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AIChatView({ project, transactions, chatHistory, setChatHistory }: AIChatViewProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const cleanQuickQuestions = [
    { text: "Kredit olishim kerakmi?", key: "kredit" },
    { text: "Xarajatlarimni tekshir", key: "expenses" },
    { text: "Foydani oshirish rejasini tuz", key: "profit" },
    { text: "Saytni boshdan oyoq tushuntir", key: "site" }
  ];

  const totalRevenue = transactions
    .filter((t) => t.type === 'kirim')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'chiqim')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Re-map history for Gemini format required by backend CJS
      const historyPayload = chatHistory.map(h => ({
        role: h.role, // already matches 'user' and 'model'
        text: h.text
      }));

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          context: {
            currentDate: new Date().toISOString().split('T')[0],
            projectName: project.name,
            revenue: project.revenue,
            expenses: project.expenses,
            profit: project.revenue - project.expenses,
            transactionSummary: {
              totalRevenue,
              totalExpenses,
              netProfit,
              profitMargin: Number(profitMargin.toFixed(2)),
              transactionsCount: transactions.length,
              latestTransactions: transactions.slice(0, 8)
            },
            platformSections: [
              'Landing',
              'Dashboard',
              'Analytics',
              'Simulator',
              'AI CFO Chat',
              'Reports',
              'Settings',
              'Admin Panel'
            ]
          },
          history: historyPayload
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modelMsg: ChatMessage = {
          id: Math.random().toString(),
          role: 'model',
          text: data.response,
          timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, modelMsg]);
      } else {
        const data = await response.json().catch(() => null);
        throw new Error(data?.details || data?.error || "Tarmoqda xatolik yuz berdi");
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: formatAiError(e?.message),
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const formatAiError = (message?: string) => {
    const text = (message || '').toLowerCase();
    if (text.includes('503') || text.includes('unavailable') || text.includes('high demand')) {
      return "AI xizmati hozir band bo'ldi. Server avtomatik qayta urinib va zaxira modelga o'tib ko'rdi, lekin hozircha javob olish qiyin. 10-20 soniyadan keyin yana yuboring.";
    }
    if (text.includes('api key') || text.includes('kaliti')) {
      return "AI kaliti sozlamasida muammo bor. Administrator GEMINI_API_KEY sozlamasini tekshirishi kerak.";
    }
    return `AI xizmatiga ulanishda xatolik yuz berdi. Sabab: ${message || "noma'lum xatolik"}.`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-in">
      
      {/* LEFT COLUMN: Business Context Snapshot & Quick Starters */}
      <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
        <div className="card bg-[#0D0D0D] border border-gold/15 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ffffff10] pb-3">
            <BrainCircuit className="w-5 h-5 text-gold shrink-0" />
            <h4 className="text-sm font-bold text-[#F0EDE6] font-syne">Biznes Konteksti</h4>
          </div>

          <p className="text-xs text-zinc-400 leading-normal font-normal">
            AI Moliyachi hozirgi loyihangiz ko'rsatkichlarini avtomatik ravishda so'rovingizga integratsiya qiladi:
          </p>

          <div className="space-y-2.5 pt-1.5">
            <div className="bg-[#161616] p-3 rounded-lg border border-[#ffffff04] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">LOYIHA</span>
              <span className="text-gold font-bold">{project.name}</span>
            </div>
            <div className="bg-[#161616] p-3 rounded-lg border border-[#ffffff04] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">DAROMAD (REVENUE)</span>
              <span className="text-[#F0EDE6] font-bold">{(project.revenue).toLocaleString()} UZS</span>
            </div>
            <div className="bg-[#161616] p-3 rounded-lg border border-[#ffffff04] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">XARAJAT (EXPENSES)</span>
              <span className="text-[#F0EDE6] font-bold">{(project.expenses).toLocaleString()} UZS</span>
            </div>
            <div className="bg-[#161616] p-3 rounded-lg border border-[#ffffff04] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">SOF FOYDA (MARGIN)</span>
              <span className="text-[#2D9F6E] font-bold">{(project.revenue - project.expenses).toLocaleString()} UZS</span>
            </div>
          </div>
        </div>

        {/* Quick Question Prompts */}
        <div className="card bg-bg-card p-5 space-y-3.5">
          <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-gold" />
            Tezkor Savollar:
          </h4>
          
          <div className="space-y-2.5">
            {cleanQuickQuestions.map((q) => (
              <button
                key={q.key}
                onClick={() => handleSend(q.text)}
                disabled={loading}
                className="w-full text-left p-3 rounded-lg bg-black/40 hover:bg-[#C9A84C08] border border-[#ffffff07] hover:border-gold/25 text-xs text-zinc-300 hover:text-gold transition-all flex items-center justify-between font-normal cursor-pointer"
              >
                <span>{q.text}</span>
                <CornerDownRight className="w-3.5 h-3.5 text-gold opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#ffffff09] flex justify-between items-center">
            <span className="text-[10px] text-zinc-600">Suhbatni tiklash:</span>
            <button 
              onClick={clearChat}
              className="text-[10px] text-zinc-500 hover:text-red-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Suhbatni tozalash
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI CFO Chat Console */}
      <div className="lg:col-span-8 card bg-bg-card p-0 overflow-hidden flex flex-col justify-between border border-[#ffffff10] min-h-[500px]">
        {/* Chat Header */}
        <div className="h-14 bg-[#0d0d0d] px-5 border-b border-[#ffffff10] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2D9F6E] animate-pulse" />
            <div>
              <h3 className="text-xs font-bold text-[#F0EDE6] tracking-tight font-syne">AI CFO (Virtual Moliyaviy Direktor)</h3>
              <p className="text-[10px] text-zinc-500 font-semibold">Tizim holati: Onlayn - Gemini 2.5 Flash bilan ishlaydi</p>
            </div>
          </div>
        </div>

        {/* Chat messages stream area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[360px] min-h-[300px]">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3.5 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-gold animate-bounce">
                <BrainCircuit className="w-6 h-6 text-gold" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#F0EDE6] font-syne">Assalomu alaykum, biznes egasi!</h4>
                <p className="text-xs text-zinc-400 leading-normal font-normal">
                  Men "AI Moliyachi" shaxsiy moliyaviy direktorizman. Sayt bo'limlarini tushuntiraman, biznesingizni tahlil qilaman va moliya yoki umumiy savollaringizga aniq javob beraman.
                </p>
              </div>
            </div>
          ) : (
            chatHistory.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center text-xs font-bold font-syne border ${
                  m.role === 'user' 
                    ? 'bg-gold/10 text-gold border-gold/20' 
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {m.role === 'user' ? 'U' : 'AI'}
                </div>

                {/* Bubble message */}
                <div className={`p-4 rounded-xl text-xs leading-relaxed space-y-1.5 font-normal ${
                  m.role === 'user'
                    ? 'bg-gold/10 text-[#F0EDE6] border border-gold/20 rounded-tr-none'
                    : 'bg-[#0F0F0F] text-zinc-200 border border-[#ffffff0a] rounded-tl-none font-sans'
                }`}>
                  {/* Simplistic renderer for markdown support cleanly */}
                  <div className="whitespace-pre-line prose prose-invert font-normal">
                    {m.text}
                  </div>
                  <span className="block text-[9.5px] text-zinc-600 text-right font-medium">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Loading bubble indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-[30px] h-[30px] rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-500 font-bold shrink-0">
                AI
              </div>
              <div className="p-4 bg-[#0F0F0F] border border-[#ffffff0a] rounded-xl rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input panel block */}
        <div className="p-4 bg-[#0A0A0A] border-t border-[#ffffff10]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-3"
          >
            <input 
              type="text"
              required
              disabled={loading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Moliya, sayt bo'limlari yoki istalgan savolingizni yozing..."
              className="flex-1 h-11 px-4 text-xs bg-zinc-900 border border-zinc-800 focus:border-gold rounded-lg text-zinc-200 outline-none placeholder-zinc-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 px-5 rounded-lg bg-gold text-[#0a0a0a] hover:bg-gold-light disabled:opacity-50 disabled:hover:bg-gold transition-colors flex items-center justify-center cursor-pointer font-syne font-bold font-normal"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
