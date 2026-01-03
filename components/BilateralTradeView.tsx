
import React, { useState, useEffect, useRef } from 'react';
import { Store, UserCheck, CheckCircle2, DollarSign, ShoppingBag, Plus, MapPin, Clock, Zap, Play, Pause, StopCircle, Users, Activity, Timer } from 'lucide-react';
import { MOCK_SHOP_APPLICATIONS, MOCK_SETTLEMENTS, MOCK_RESIDENTS } from '../constants';

// --- Types for Grab Feature ---
type GrabStatus = 'idle' | 'active' | 'paused' | 'ended';

interface GrabLog {
  id: number;
  residentName: string;
  amount: number;
  time: string;
}

export const BilateralTradeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // --- Grab Order State ---
  const [grabStatus, setGrabStatus] = useState<GrabStatus>('idle');
  const [poolConfig, setPoolConfig] = useState({
    totalAmount: 500000,
    singleLimit: 8000,
    targetGroup: '龙邦镇第一互助组'
  });
  const [grabStats, setGrabStats] = useState({
    remainingAmount: 500000,
    participantCount: 0,
    startTime: 0,
    elapsedTime: 0 // seconds
  });
  const [liveLogs, setLiveLogs] = useState<GrabLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const simulatorRef = useRef<number | null>(null);

  // --- Grab Order Logic ---

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGrab = () => {
    if (grabStatus === 'idle' || grabStatus === 'ended') {
      // Reset
      setGrabStats({
        remainingAmount: poolConfig.totalAmount,
        participantCount: 0,
        startTime: Date.now(),
        elapsedTime: 0
      });
      setLiveLogs([]);
    }
    setGrabStatus('active');
  };

  const pauseGrab = () => setGrabStatus('paused');
  
  const endGrab = () => {
    setGrabStatus('ended');
    if (timerRef.current) clearInterval(timerRef.current);
    if (simulatorRef.current) clearInterval(simulatorRef.current);
  };

  // Simulation Effect
  useEffect(() => {
    if (grabStatus === 'active') {
      // 1. Timer
      timerRef.current = window.setInterval(() => {
        setGrabStats(prev => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
      }, 1000);

      // 2. Grab Simulator
      simulatorRef.current = window.setInterval(() => {
        // Random chance to grab
        if (Math.random() > 0.3) {
          const randomResident = MOCK_RESIDENTS[Math.floor(Math.random() * MOCK_RESIDENTS.length)];
          // Fixed amount 8000 per requirement
          const amount = 8000; 
          
          setGrabStats(prev => {
            const newRemaining = Math.max(0, prev.remainingAmount - amount);
            if (newRemaining < amount) {
               endGrab(); // Auto end if depleted
            }
            return {
              ...prev,
              remainingAmount: newRemaining,
              participantCount: prev.participantCount + 1
            };
          });

          const newLog: GrabLog = {
            id: Date.now(),
            residentName: randomResident.name,
            amount: amount,
            time: new Date().toLocaleTimeString()
          };

          setLiveLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
        }
      }, 800); // Speed of grabs
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (simulatorRef.current) clearInterval(simulatorRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (simulatorRef.current) clearInterval(simulatorRef.current);
    };
  }, [grabStatus]);

  const menuItems = [
    { id: 'shop-apply', label: '商铺申请', icon: Store, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'staff-audit', label: '商铺人员审核', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'trade-settle', label: '交易结算', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'order-settle', label: '边民订单结算', icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { id: 'buy-confirm', label: '边民购买确认', icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'grab-orders', label: '边民抢单管理', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">双边交易 (Bilateral Trade)</h2>
        <p className="text-gray-500 text-sm mt-1">一级市场商铺管理与互市交易结算中心</p>
      </div>

      {/* Grid Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              activeTab === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white bg-white hover:border-blue-100'
            }`}
          >
            <div className={`p-3 rounded-full ${item.bg} ${item.color} mb-3`}>
              <item.icon size={24} />
            </div>
            <span className="font-bold text-gray-700 text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        
        {/* --- GRAB ORDERS MODULE (DEEP DEV) --- */}
        {activeTab === 'grab-orders' && (
          <div className="flex flex-col h-full">
             {/* Header / Config Bar */}
             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                   <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                      <Zap className="text-pink-600" fill="currentColor" /> 边民抢单控制台
                   </h3>
                   <p className="text-sm text-gray-500 mt-1">实时发布一级市场交易订单，监控边民抢单进度。</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                   <div className="px-3 border-r border-gray-200">
                      <span className="text-xs text-gray-400 block">目标互助组</span>
                      <span className="font-bold text-sm text-gray-800">{poolConfig.targetGroup}</span>
                   </div>
                   <div className="px-3 border-r border-gray-200">
                      <span className="text-xs text-gray-400 block">投放总金额</span>
                      <span className="font-bold text-sm text-gray-800">¥{poolConfig.totalAmount.toLocaleString()}</span>
                   </div>
                   <div className="px-3">
                      <span className="text-xs text-gray-400 block">固定额度/单</span>
                      <span className="font-bold text-sm text-gray-800">¥8,000</span>
                   </div>
                </div>
             </div>

             {/* Main Operational Area */}
             <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Real-time Visualizer */}
                <div className="lg:col-span-2 space-y-6">
                   {/* Status Cards */}
                   <div className="grid grid-cols-3 gap-4">
                      <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 flex flex-col items-center justify-center">
                         <span className="text-xs text-pink-600 font-bold uppercase mb-1">剩余金额</span>
                         <span className="text-2xl font-bold text-gray-800">¥{grabStats.remainingAmount.toLocaleString()}</span>
                         <div className="w-full bg-pink-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${(grabStats.remainingAmount / poolConfig.totalAmount) * 100}%` }}></div>
                         </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center justify-center">
                         <span className="text-xs text-blue-600 font-bold uppercase mb-1">参与人数</span>
                         <span className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Users size={20} className="text-blue-400" /> {grabStats.participantCount}
                         </span>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center justify-center">
                         <span className="text-xs text-indigo-600 font-bold uppercase mb-1">运行时长</span>
                         <span className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Timer size={20} className="text-indigo-400" /> {formatTime(grabStats.elapsedTime)}
                         </span>
                      </div>
                   </div>

                   {/* Circular Progress & Controls */}
                   <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center relative min-h-[300px]">
                      {/* Big Circle */}
                      <div className="relative w-64 h-64 flex items-center justify-center">
                         {/* SVG Circle for progress */}
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="120" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                            <circle 
                              cx="128" cy="128" r="120" 
                              stroke="#ec4899" strokeWidth="12" fill="transparent" 
                              strokeDasharray={2 * Math.PI * 120}
                              strokeDashoffset={2 * Math.PI * 120 * (grabStats.remainingAmount / poolConfig.totalAmount)}
                              className="transition-all duration-500 ease-out"
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm text-gray-400 uppercase font-bold">当前进度</span>
                            <span className="text-4xl font-bold text-gray-800">
                               {Math.round(((poolConfig.totalAmount - grabStats.remainingAmount) / poolConfig.totalAmount) * 100)}%
                            </span>
                            <span className="text-xs text-pink-500 font-bold bg-pink-100 px-2 py-0.5 rounded mt-2">
                               {grabStatus === 'active' ? '正在抢单...' : grabStatus === 'paused' ? '已暂停' : grabStatus === 'ended' ? '已结束' : '待开始'}
                            </span>
                         </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex gap-4 mt-8">
                         {grabStatus === 'idle' || grabStatus === 'ended' ? (
                            <button onClick={startGrab} className="flex items-center gap-2 px-8 py-3 bg-pink-600 text-white rounded-full font-bold text-lg hover:bg-pink-700 shadow-lg shadow-pink-200 transform hover:scale-105 transition-all">
                               <Play fill="currentColor" /> 开始抢单
                            </button>
                         ) : (
                            <>
                               {grabStatus === 'active' ? (
                                  <button onClick={pauseGrab} className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 shadow-md">
                                     <Pause fill="currentColor" size={18} /> 暂停
                                  </button>
                               ) : (
                                  <button onClick={startGrab} className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 shadow-md">
                                     <Play fill="currentColor" size={18} /> 继续
                                  </button>
                               )}
                               <button onClick={endGrab} className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-700 shadow-md">
                                  <StopCircle fill="currentColor" size={18} /> 结束
                               </button>
                            </>
                         )}
                      </div>
                   </div>
                </div>

                {/* Right: Live Log Feed */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col h-[500px] shadow-2xl">
                   <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <h4 className="font-bold text-slate-100">实时抢单播报 (Live)</h4>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                      {liveLogs.length === 0 ? (
                         <div className="text-center text-slate-600 mt-20">
                            <Activity size={40} className="mx-auto mb-2 opacity-50" />
                            <p>等待抢单开始...</p>
                         </div>
                      ) : (
                         liveLogs.map((log) => (
                            <div key={log.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg border-l-4 border-pink-500 animate-slide-in-right">
                               <div className="flex flex-col">
                                  <span className="font-bold text-sm text-slate-200">{log.residentName}</span>
                                  <span className="text-[10px] text-slate-500">{log.time}</span>
                               </div>
                               <div className="text-right">
                                  <span className="font-mono text-pink-400 font-bold">+¥{log.amount.toLocaleString()}</span>
                                  <span className="text-[10px] text-green-500 block">成功</span>
                               </div>
                            </div>
                         ))
                      )}
                      <div ref={logsEndRef}></div>
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 text-center">
                      数据实时同步至 H2018 监管系统
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Existing Shop Apply View (Preserved) */}
        {activeTab === 'shop-apply' && (
          <div className="p-6 space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Store size={20} /> 商铺申请列表</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
                   <Plus size={16} /> 申请新摊位
                </button>
             </div>
             <div className="divide-y divide-gray-100">
                {MOCK_SHOP_APPLICATIONS.map((app) => (
                   <div key={app.id} className="py-4 flex items-center justify-between">
                      <div>
                         <h4 className="font-bold text-gray-800">{app.shopName}</h4>
                         <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {app.location}</p>
                      </div>
                      <div className="text-right">
                         <span className={`text-xs px-2 py-1 rounded font-bold ${
                            app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                         }`}>
                            {app.status === 'approved' ? '已通过' : '审核中'}
                         </span>
                         <p className="text-xs text-gray-400 mt-1">{app.submitDate}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {(activeTab === 'trade-settle' || activeTab === 'order-settle') && (
           <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><DollarSign size={20} /> 结算流水</h3>
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr><th className="p-3">流水号</th><th className="p-3">订单号</th><th className="p-3 text-right">金额</th><th className="p-3 text-center">状态</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {MOCK_SETTLEMENTS.map(s => (
                       <tr key={s.id}>
                          <td className="p-3 font-mono text-gray-600">{s.id}</td>
                          <td className="p-3">{s.orderId}</td>
                          <td className="p-3 text-right font-bold">¥{s.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                             <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {s.status === 'success' ? '成功' : '处理中'}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {(activeTab !== 'shop-apply' && activeTab !== 'trade-settle' && activeTab !== 'order-settle' && activeTab !== 'grab-orders') && (
           <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
              <ShoppingBag size={48} className="opacity-20 mb-4" />
              <p>该功能模块正在接入一级市场实时数据...</p>
           </div>
        )}
      </div>
    </div>
  );
};
