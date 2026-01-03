
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration, Content } from "@google/genai";
import { 
  MessageSquare, X, Send, Sparkles, Loader2, Minimize2, 
  Navigation, Bot, Info, TrendingUp, AlertTriangle, ChevronRight,
  User, ShoppingCart, ShieldCheck, Database
} from 'lucide-react';
import { UserRole, OrderStatus } from '../types';
import { MOCK_ORDERS, MOCK_RESIDENTS, MOCK_DEMANDS } from '../constants';

interface AIChatbotProps {
  userRole: UserRole;
  onNavigate: (viewId: string) => void;
  currentView: string;
}

const VIEW_MAPPING: Record<string, string> = {
  'dashboard': 'dashboard',
  'bilateral trade': 'bilateral-trade',
  'customs': 'customs-services',
  'orders': 'orders',
  'residents': 'residents',
  'finance': 'finance',
  'market': 'market',
  'logistics': 'logistics',
  'news': 'news',
  'risk': 'risk',
  'cloud db': 'cloud-db',
  'enterprise': 'enterprise-dashboard',
  'profile': 'resident-dashboard'
};

const SUGGESTIONS = [
  "帮我分析今日交易趋势",
  "数据库状态健康吗？",
  "有哪些待处理的风控预警？",
  "查看当前的边民实名进度"
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ userRole, onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isOpen, isLoading]);

  const platformContext = useMemo(() => {
    const processingOrders = MOCK_ORDERS.filter(o => o.status === OrderStatus.PROCESSING).length;
    const pendingDeposit = MOCK_ORDERS.filter(o => o.status === OrderStatus.PENDING_DEPOSIT).length;
    const activeResidents = MOCK_RESIDENTS.filter(r => r.status === 'active').length;
    const totalDemands = MOCK_DEMANDS.length;

    return `
    平台实时数据摘要：
    - 进行中订单：${processingOrders} 笔
    - 待缴纳保证金订单：${pendingDeposit} 笔
    - 活跃边民总数：${activeResidents} 人
    - 数据库状态：Running (阿里云 RDS MySQL 8.0)
    `;
  }, []);

  const handleSendMessage = async (textOverride?: string) => {
    const userMsg = textOverride || inputValue;
    if (!userMsg.trim() || isLoading) return;

    const newUserContent: Content = { role: 'user', parts: [{ text: userMsg }] };
    setHistory(prev => [...prev, newUserContent]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const navTool: FunctionDeclaration = {
        name: 'navigate_to_page',
        parameters: {
          type: Type.OBJECT,
          description: 'Navigate the user to a specific page or section of the application.',
          properties: {
            page: {
              type: Type.STRING,
              description: 'The destination page logical name.',
              enum: Object.keys(VIEW_MAPPING)
            }
          },
          required: ['page']
        }
      };

      const systemInstruction = `你是“云智边贸”数字化平台的智能专家助手。
      当前用户信息：
      - 角色：${userRole || '游客'}
      - 正在查看：${currentView}
      
      ${platformContext}
      
      你的职责：
      1. 能够分析平台数据并回答关于贸易、订单、基础设施（阿里云RDS数据库）、风控等业务问题。
      2. 如果用户问到数据库压力、IP白名单或底层系统状态，请引导至 'cloud db' 页面。
      3. 引导用户操作：当用户想看某个模块时，必须使用 'navigate_to_page' 工具。
      
      对话风格：专业、高效、亲和。请使用中文回答。`;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [navTool] }],
        },
        history: history
      });

      // Fix: Cast response to any to bypass potential type mismatches in GenerateContentResponse
      const response = await chat.sendMessage({ message: userMsg }) as any;
      
      let modelText = response.text || "我收到您的信息了，正在为您处理。";

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'navigate_to_page') {
            const pageKey = call.args['page'] as string;
            const targetView = VIEW_MAPPING[pageKey];
            
            if (targetView) {
              onNavigate(targetView);
              modelText = `好的，已为您跳转至 **${pageKey}** 管理模块。`;
            }
          }
        }
      }

      setHistory(prev => [...prev, { role: 'model', parts: [{ text: modelText }] }]);

    } catch (error) {
      console.error("AI Error:", error);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "抱歉，云端连接出现了一点小状况。" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Fix: Using correct React event type
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (text: string) => {
    return text.split('**').map((part, i) => 
      i % 2 === 1 ? <strong key={i} {...({ className: "text-blue-700 font-bold" } as any)}>{part}</strong> : part
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          {...({ className: "fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20 backdrop-blur-sm" } as any)}
        >
          <div {...({ className: "absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:animate-ping opacity-20" } as any)}></div>
          <Sparkles size={28} {...({ className: "relative z-10" } as any)} />
          <span {...({ className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white" } as any)}>AI</span>
        </button>
      )}

      {isOpen && (
        <div {...({ className: "fixed bottom-6 right-6 w-full max-w-[420px] h-[700px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col border border-white/50 z-50 animate-scale-in overflow-hidden" } as any)}>
          <div {...({ className: "bg-slate-900 text-white p-5 flex justify-between items-center relative overflow-hidden" } as any)}>
            <div {...({ className: "absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" } as any)}></div>
            <div {...({ className: "flex items-center gap-3 relative z-10" } as any)}>
              <div {...({ className: "w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg" } as any)}>
                <Bot size={24} {...({ className: "text-white" } as any)} />
              </div>
              <div {...({ className: "" } as any)}>
                <h3 {...({ className: "font-bold text-base tracking-tight" } as any)}>云智AI业务专家</h3>
                <div {...({ className: "flex items-center gap-1.5" } as any)}>
                  <span {...({ className: "w-2 h-2 bg-emerald-400 rounded-full animate-pulse" } as any)}></span>
                  <span {...({ className: "text-[10px] text-slate-400 font-medium uppercase tracking-widest" } as any)}>Gemini 3.0 Flash Online</span>
                </div>
              </div>
            </div>
            <div {...({ className: "flex items-center gap-1 relative z-10" } as any)}>
              <button 
                onClick={() => setIsOpen(false)} 
                {...({ className: "hover:bg-slate-800 p-2 rounded-full transition-colors text-slate-400 hover:text-white" } as any)}
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>

          <div {...({ className: "bg-slate-50 px-5 py-2 flex gap-4 overflow-x-auto border-b border-gray-100 no-scrollbar" } as any)}>
             <div {...({ className: "flex items-center gap-1 text-[10px] text-slate-500 whitespace-nowrap" } as any)}>
                <Database size={12} {...({ className: "text-blue-500" } as any)} />
                <span>RDS 健康 Running</span>
             </div>
             <div {...({ className: "flex items-center gap-1 text-[10px] text-slate-500 whitespace-nowrap" } as any)}>
                <ShieldCheck size={12} {...({ className: "text-emerald-500" } as any)} />
                <span>风控指数 98.5</span>
             </div>
          </div>

          <div {...({ className: "flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-gradient-to-b from-white to-slate-50" } as any)}>
            {history.length === 0 && (
               <div {...({ className: "flex flex-col items-center justify-center h-full text-center p-8 space-y-4" } as any)}>
                  <div {...({ className: "w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2" } as any)}>
                     <Bot size={40} {...({ className: "opacity-20" } as any)} />
                  </div>
                  <h4 {...({ className: "font-bold text-slate-800" } as any)}>您好，我是您的AI业务助理</h4>
                  <p {...({ className: "text-sm text-slate-500 leading-relaxed" } as any)}>
                    我可以帮您分析贸易数据、监控数据库健康、解答政策疑难。
                  </p>
               </div>
            )}

            {history.map((msg, idx) => (
              <div key={idx} {...({ className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in` } as any)}>
                <div {...({ className: `flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}` } as any)}>
                  <div {...({ className: `w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-600 text-white'
                  }` } as any)}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div 
                    {...({ className: `p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                    }` } as any)}
                  >
                    {msg.role === 'model' && <Sparkles size={14} {...({ className: "text-blue-500 mb-1.5 block" } as any)} />}
                    {renderMessageContent(msg.parts[0].text || '')}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div {...({ className: "flex justify-start animate-pulse" } as any)}>
                <div {...({ className: "flex gap-3 max-w-[85%]" } as any)}>
                   <div {...({ className: "w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white" } as any)}>
                      <Loader2 size={16} {...({ className: "animate-spin" } as any)} />
                   </div>
                   <div {...({ className: "bg-white p-3.5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2" } as any)}>
                      <span {...({ className: "text-xs text-gray-400 font-medium" } as any)}>正在深度分析数据...</span>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div {...({ className: "px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white/50 border-t border-gray-50" } as any)}>
             {SUGGESTIONS.map((s, idx) => (
               <button 
                 key={idx} 
                 onClick={() => handleSendMessage(s)}
                 {...({ className: "px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-full whitespace-nowrap hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 shadow-sm" } as any)}
               >
                 {s} <ChevronRight size={10} {...({ className: "opacity-40" } as any)} />
               </button>
             ))}
          </div>

          <div {...({ className: "p-5 bg-white border-t border-gray-100" } as any)}>
            <div {...({ className: "flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white transition-all" } as any)}>
              <input
                type="text"
                value={inputValue}
                onChange={(e: any) => setInputValue(e.target.value)}
                {...({ onKeydown: handleKeyPress, placeholder: "在此输入指令...", className: "flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-slate-400", disabled: isLoading } as any)}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                {...({ className: "p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-90 flex items-center justify-center" } as any)}
              >
                {isLoading ? <Loader2 size={18} {...({ className: "animate-spin" } as any)} /> : <Send size={18} />}
              </button>
            </div>
            <div {...({ className: "flex justify-between items-center mt-3" } as any)}>
               <p {...({ className: "text-[9px] text-slate-400 font-medium flex items-center gap-1" } as any)}>
                 <Info size={10} /> Powered by Gemini API
               </p>
               <button onClick={() => setHistory([])} {...({ className: "text-[9px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors" } as any)}>
                 清空对话
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
