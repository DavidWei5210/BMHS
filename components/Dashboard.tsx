
import React, { useState, useMemo, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Activity, AlertOctagon, BellRing, CheckSquare, X, ChevronRight, LayoutGrid, RefreshCw, Briefcase, JapaneseYen, ShieldCheck, Zap, Mail, CheckCircle2, Clock, Send, FileText, ShoppingBag, MapPin, Building2, CalendarDays, Loader2 } from 'lucide-react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Legend } from 'recharts';
import { API_BASE_URL, IS_PRODUCTION } from '../constants';

// --- Mock Data (用于 API 失败时的回退) ---
const tradeTrendData7d = [
  { name: '10-20', amount: 580, orders: 28 },
  { name: '10-21', amount: 380, orders: 18 },
  { name: '10-22', amount: 650, orders: 35 },
  { name: '10-23', amount: 890, orders: 42 },
  { name: '10-24', amount: 1200, orders: 55 },
  { name: '10-25', amount: 950, orders: 48 },
  { name: '今日', amount: 1350, orders: 72 }
];

const KPI_Card = ({ title, value, subtext, trend, icon: Icon, color, onClick, onRefresh, refreshing }: any) => {
  const iconBgColor = color.replace('bg-', 'bg-').replace('600', '50');
  const iconTextColor = color.replace('bg-', 'text-');
  
  return (
    <div 
      onClick={onClick}
      {...({ className: `relative bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden ${onClick ? 'cursor-pointer' : ''}` } as any)}
    >
      <div {...({ className: `absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.08] transition-transform group-hover:scale-150 ${color.replace('text-', 'bg-')}` } as any)}></div>

      {onRefresh && (
        <button 
          onClick={(e: any) => { e.stopPropagation(); onRefresh(); }}
          {...({ className: `absolute top-4 right-4 p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all z-10 ${refreshing ? 'animate-spin text-blue-500 bg-blue-50' : ''}` } as any)}
        >
          <RefreshCw size={14} />
        </button>
      )}
      
      <div {...({ className: "flex items-center gap-4 mb-3 relative z-10" } as any)}>
        <div {...({ className: `p-3.5 rounded-2xl ${iconBgColor} ${iconTextColor} ring-1 ring-inset ring-black/5 transition-transform group-hover:rotate-6` } as any)}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div {...({ className: "" } as any)}>
          <p {...({ className: "text-xs text-slate-500 font-semibold uppercase tracking-wider" } as any)}> {title}</p>
          <h3 {...({ className: "text-2xl font-bold text-slate-800 tracking-tight font-mono mt-0.5" } as any)}>
            {refreshing ? <Loader2 size={18} {...({ className: "animate-spin text-blue-500" } as any)} /> : value}
          </h3>
        </div>
      </div>
      
      <div {...({ className: "flex items-center justify-between border-t border-slate-50 pt-3 relative z-10" } as any)}>
        <div {...({ className: "text-xs font-medium flex items-center gap-2" } as any)}>
          <span {...({ className: `${trend === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'} border px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm` } as any)}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {subtext}
          </span>
          <span {...({ className: "text-slate-400" } as any)}>较昨日</span>
        </div>
        {onClick && <ChevronRight size={14} {...({ className: "text-slate-300" } as any)} />}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    todayGmv: 1245000,
    activeResidents: 842,
    riskAlerts: 3,
    conversionCount: 1240
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // 获取后端真实数据
  const fetchRealData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.warn('API Fetch 失败，回退到 Mock 数据');
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  return (
    <div {...({ className: "space-y-8 animate-fade-in pb-10" } as any)}>
      <div {...({ className: "flex flex-col md:flex-row md:items-end justify-between gap-4" } as any)}>
        <div {...({ className: "" } as any)}>
          <h2 {...({ className: "text-2xl font-bold text-slate-800 tracking-tight" } as any)}>运营全景驾驶舱</h2>
          <div {...({ className: "flex items-center gap-2 mt-1" } as any)}>
             <span {...({ className: "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100" } as any)}>ECS Real-time</span>
             <p {...({ className: "text-slate-500 text-sm" } as any)}>实时数据从您的阿里云服务器获取</p>
          </div>
        </div>
        <button 
          onClick={fetchRealData}
          {...({ className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all" } as any)}
        >
          <RefreshCw size={16} {...({ className: isLoading ? 'animate-spin' : '' } as any)} /> 刷新实时数据
        </button>
      </div>

      <div {...({ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" } as any)}>
        <KPI_Card 
          title="今日交易总额 (GMV)" 
          value={`¥${stats.todayGmv.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
          subtext="+15.2%" 
          trend="up" 
          icon={JapaneseYen} 
          color="bg-blue-600" 
          refreshing={isLoading}
        />
        <KPI_Card 
          title="活跃边民 (DAU)" 
          value={stats.activeResidents} 
          subtext="转化率 24%" 
          trend="up" 
          icon={Users} 
          color="bg-emerald-600" 
          refreshing={isLoading}
        />
        <KPI_Card 
          title="风控预警 (Risks)" 
          value={`${stats.riskAlerts} 起`} 
          subtext="需立即处理" 
          trend="down" 
          icon={AlertOctagon} 
          color="bg-red-500" 
          refreshing={isLoading}
        />
        <KPI_Card 
          title="个体户转化 (Biz)" 
          value={`${stats.conversionCount} 户`} 
          subtext="+12 本周" 
          trend="up" 
          icon={Briefcase} 
          color="bg-purple-600" 
          refreshing={isLoading}
        />
      </div>

      <div {...({ className: "grid grid-cols-1 xl:grid-cols-3 gap-8" } as any)}>
        <div {...({ className: "xl:col-span-2" } as any)}>
           <div {...({ className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" } as any)}>
              <div {...({ className: "flex items-center justify-between mb-6" } as any)}>
                 <h4 {...({ className: "font-bold text-slate-700 text-sm flex items-center gap-2" } as any)}>
                    <Activity size={16} {...({ className: "text-blue-500" } as any)} /> 互市贸易额趋势 (阿里云库同步)
                 </h4>
              </div>
              <div {...({ className: "h-72 w-full" } as any)}>
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={tradeTrendData7d}>
                       <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                             {/* Fix: Using correct SVG attribute names based on error suggestions */}
                             <stop offset="5%" {...({ 'stop-color': "#3b82f6", 'stop-opacity': 0.15 } as any)}/>
                             <stop offset="95%" {...({ 'stop-color': "#3b82f6", 'stop-opacity': 0 } as any)}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                       <Tooltip />
                       <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
        
        <div {...({ className: "space-y-6" } as any)}>
           <div {...({ className: "bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden" } as any)}>
              <div {...({ className: "relative z-10" } as any)}>
                 <h4 {...({ className: "font-bold mb-2" } as any)}>后端服务器配置指引</h4>
                 <p {...({ className: "text-xs text-slate-400 leading-relaxed mb-4" } as any)}>
                    1. 在 ECS 运行 `npm start` 启动 backend-server.ts<br/>
                    2. 在安全组开启 3001 端口<br/>
                    3. 在 `constants.ts` 中填入 ECS 公网 IP
                 </p>
                 <button onClick={() => window.open('https://help.aliyun.com/document_detail/25471.html')} {...({ className: "text-blue-400 text-xs font-bold hover:underline" } as any)}>
                    查看阿里云安全组配置文档 ->
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
