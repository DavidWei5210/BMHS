
import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Activity, Server, Clock, RefreshCw, Plus, Trash2, Globe, Lock, Cpu, MemoryStick, HardDrive, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_DB_CONFIG, MOCK_DB_PERFORMANCE } from '../constants';

export const DatabaseManagement: React.FC = () => {
  const [whitelist, setWhitelist] = useState(['106.14.23.155', '121.43.10.88']);
  const [newIp, setNewIp] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'security' | 'terminal'>('monitor');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const addIp = () => {
    if (newIp && !whitelist.includes(newIp)) {
      setWhitelist([...whitelist, newIp]);
      setNewIp('');
    }
  };

  const removeIp = (ip: string) => {
    setWhitelist(whitelist.filter(i => i !== ip));
  };

  return (
    <div {...({ className: "space-y-6 animate-fade-in pb-10" } as any)}>
      {/* 1. Page Header */}
      <div {...({ className: "flex flex-col md:flex-row md:items-center justify-between gap-4" } as any)}>
        <div {...({ className: "" } as any)}>
          <h2 {...({ className: "text-2xl font-bold text-slate-800 flex items-center gap-2" } as any)}>
            <Database {...({ className: "text-blue-600" } as any)} /> 阿里云 RDS 数据库管理
          </h2>
          <p {...({ className: "text-slate-500 text-sm mt-1" } as any)}>云端高可用实例管理：MySQL 8.0 核心贸易库</p>
        </div>
        <div {...({ className: "flex gap-2" } as any)}>
          <button 
            onClick={handleRefresh}
            {...({ className: `flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all ${isRefreshing ? 'opacity-50' : ''}` } as any)}
          >
            <RefreshCw size={16} {...({ className: isRefreshing ? 'animate-spin' : '' } as any)} /> 刷新状态
          </button>
          <button {...({ className: "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md" } as any)}>
            规格变更
          </button>
        </div>
      </div>

      {/* 2. Instance Summary Cards */}
      <div {...({ className: "grid grid-cols-1 md:grid-cols-4 gap-4" } as any)}>
        <div {...({ className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm" } as any)}>
          <div {...({ className: "flex items-center gap-3 mb-2 text-slate-400" } as any)}>
            <Server size={18} />
            <span {...({ className: "text-xs font-bold uppercase tracking-wider" } as any)}>实例状态</span>
          </div>
          <div {...({ className: "flex items-center gap-2" } as any)}>
            <div {...({ className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse" } as any)}></div>
            <span {...({ className: "text-xl font-bold text-slate-800" } as any)}>{MOCK_DB_CONFIG.status}</span>
          </div>
          <p {...({ className: "text-[10px] text-slate-400 mt-1" } as any)}>实例ID: {MOCK_DB_CONFIG.instanceId}</p>
        </div>

        <div {...({ className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm" } as any)}>
          <div {...({ className: "flex items-center gap-3 mb-2 text-slate-400" } as any)}>
            <Cpu size={18} />
            <span {...({ className: "text-xs font-bold uppercase tracking-wider" } as any)}>CPU 使用率</span>
          </div>
          <div {...({ className: "flex items-end gap-2" } as any)}>
            <span {...({ className: "text-2xl font-bold text-slate-800" } as any)}>32%</span>
            <span {...({ className: "text-xs text-emerald-500 font-medium mb-1" } as any)}>正常</span>
          </div>
          <div {...({ className: "w-full h-1.5 bg-slate-100 rounded-full mt-2" } as any)}>
            <div {...({ className: "h-full bg-blue-500 rounded-full", style: { width: '32%' } } as any)}></div>
          </div>
        </div>

        <div {...({ className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm" } as any)}>
          <div {...({ className: "flex items-center gap-3 mb-2 text-slate-400" } as any)}>
            <HardDrive size={18} />
            <span {...({ className: "text-xs font-bold uppercase tracking-wider" } as any)}>存储使用量</span>
          </div>
          <div {...({ className: "flex items-end gap-2" } as any)}>
            <span {...({ className: "text-2xl font-bold text-slate-800" } as any)}>{MOCK_DB_CONFIG.usedStorageGb} GB</span>
            <span {...({ className: "text-xs text-slate-400 mb-1" } as any)}>/ {MOCK_DB_CONFIG.storageGb} GB</span>
          </div>
          <div {...({ className: "w-full h-1.5 bg-slate-100 rounded-full mt-2" } as any)}>
            <div {...({ className: "h-full bg-indigo-500 rounded-full", style: { width: `${(MOCK_DB_CONFIG.usedStorageGb / MOCK_DB_CONFIG.storageGb) * 100}%` } } as any)}></div>
          </div>
        </div>

        <div {...({ className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm" } as any)}>
          <div {...({ className: "flex items-center gap-3 mb-2 text-slate-400" } as any)}>
            <Activity size={18} />
            <span {...({ className: "text-xs font-bold uppercase tracking-wider" } as any)}>当前连接数</span>
          </div>
          <div {...({ className: "flex items-end gap-2" } as any)}>
            <span {...({ className: "text-2xl font-bold text-slate-800" } as any)}>{MOCK_DB_CONFIG.connections}</span>
            <span {...({ className: "text-xs text-slate-400 mb-1" } as any)}>Active Users</span>
          </div>
          <p {...({ className: "text-[10px] text-slate-400 mt-1" } as any)}>最大允许: 2000</p>
        </div>
      </div>

      {/* 3. Main Content Tabs */}
      <div {...({ className: "bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden" } as any)}>
        <div {...({ className: "flex border-b border-slate-100 bg-slate-50" } as any)}>
          <button 
            onClick={() => setActiveTab('monitor')}
            {...({ className: `px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'monitor' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600' : 'text-slate-500 hover:bg-slate-100'}` } as any)}
          >
            <Activity size={16} /> 性能监控
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            {...({ className: `px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'security' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600' : 'text-slate-500 hover:bg-slate-100'}` } as any)}
          >
            <ShieldCheck size={16} /> 安全配置 (白名单)
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            {...({ className: `px-6 py-4 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'terminal' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600' : 'text-slate-500 hover:bg-slate-100'}` } as any)}
          >
            <Terminal size={16} /> SQL 诊断
          </button>
        </div>

        <div {...({ className: "p-8" } as any)}>
          {/* MONITOR TAB */}
          {activeTab === 'monitor' && (
            <div {...({ className: "space-y-8 animate-fade-in" } as any)}>
              <div {...({ className: "grid grid-cols-1 lg:grid-cols-2 gap-8" } as any)}>
                <div {...({ className: "space-y-4" } as any)}>
                  <h4 {...({ className: "text-sm font-bold text-slate-700 flex items-center gap-2" } as any)}>
                    <div {...({ className: "w-1 h-4 bg-blue-600 rounded-full" } as any)}></div> CPU & 内存负载趋势
                  </h4>
                  <div {...({ className: "h-64 bg-slate-50 rounded-xl border border-slate-100 p-4" } as any)}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DB_PERFORMANCE}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            {/* Fix: Using correct SVG attribute names based on error suggestions */}
                            <stop offset="5%" {...({ 'stop-color': "#3b82f6", 'stop-opacity': 0.1 } as any)}/>
                            <stop offset="95%" {...({ 'stop-color': "#3b82f6", 'stop-opacity': 0 } as any)}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                        <Area type="monotone" dataKey="mem" name="内存 (%)" stroke="#818cf8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div {...({ className: "space-y-4" } as any)}>
                  <h4 {...({ className: "text-sm font-bold text-slate-700 flex items-center gap-2" } as any)}>
                    <div {...({ className: "w-1 h-4 bg-indigo-600 rounded-full" } as any)}></div> IOPS 吞吐量 (Requests/s)
                  </h4>
                  <div {...({ className: "h-64 bg-slate-50 rounded-xl border border-slate-100 p-4" } as any)}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_DB_PERFORMANCE}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="iops" name="IOPS" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div {...({ className: "bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3" } as any)}>
                <Lock {...({ className: "text-blue-600 mt-1" } as any)} size={18} />
                <div {...({ className: "text-xs text-blue-700 leading-relaxed" } as any)}>
                  <strong>专家建议：</strong> 当前 IOPS 在 10:30 左右出现峰值（450），对应互助组大批量派单申报时间点。
                  建议在此时间段开启“读写分离”或“自动扩容”功能以保障稳定性。
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div {...({ className: "space-y-6 animate-fade-in max-w-2xl" } as any)}>
              <div {...({ className: "" } as any)}>
                <h4 {...({ className: "font-bold text-slate-800 mb-2 flex items-center gap-2" } as any)}>
                  <Globe size={18} {...({ className: "text-blue-500" } as any)} /> IP 白名单管理
                </h4>
                <p {...({ className: "text-sm text-slate-500" } as any)}>只有列表中的 IP 地址允许连接到此阿里云 RDS 实例。</p>
              </div>

              <div {...({ className: "flex gap-2" } as any)}>
                <input 
                  type="text" 
                  value={newIp}
                  onChange={(e: any) => setNewIp(e.target.value)}
                  placeholder="输入 IP 地址 (如 192.168.1.1)" 
                  {...({ className: "flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" } as any)}
                />
                <button 
                  onClick={addIp}
                  {...({ className: "bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors" } as any)}
                >
                  <Plus size={16} /> 添加
                </button>
              </div>

              <div {...({ className: "border border-slate-100 rounded-xl overflow-hidden shadow-sm" } as any)}>
                <table {...({ className: "w-full text-sm text-left" } as any)}>
                  <thead {...({ className: "bg-slate-50 text-slate-500 font-medium" } as any)}>
                    <tr {...({ className: "" } as any)}>
                      <th {...({ className: "px-6 py-3" } as any)}>白名单 IP 地址</th>
                      <th {...({ className: "px-6 py-3" } as any)}>所属应用/环境</th>
                      <th {...({ className: "px-6 py-3 text-right" } as any)}>操作</th>
                    </tr>
                  </thead>
                  <tbody {...({ className: "divide-y divide-slate-100" } as any)}>
                    {whitelist.map((ip, idx) => (
                      <tr key={idx} {...({ className: "hover:bg-slate-50 transition-colors" } as any)}>
                        <td {...({ className: "px-6 py-4 font-mono font-bold text-slate-700" } as any)}>{ip}</td>
                        <td {...({ className: "px-6 py-4 text-slate-500 text-xs" } as any)}>
                          {idx === 0 ? '生产环境 (杭州)' : idx === 1 ? '内部办公 VPN' : '临时添加'}
                        </td>
                        <td {...({ className: "px-6 py-4 text-right" } as any)}>
                          <button 
                            onClick={() => removeIp(ip)}
                            {...({ className: "p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" } as any)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TERMINAL TAB */}
          {activeTab === 'terminal' && (
            <div {...({ className: "animate-fade-in space-y-6" } as any)}>
              <div {...({ className: "bg-slate-900 rounded-xl p-6 shadow-2xl font-mono text-sm text-emerald-400 min-h-[300px]" } as any)}>
                <div {...({ className: "flex items-center gap-2 border-b border-slate-800 pb-4 mb-4 text-slate-500 uppercase text-xs font-bold tracking-widest" } as any)}>
                  <Terminal size={14} /> MySQL 8.0 Diagnostic Console
                </div>
                <div {...({ className: "space-y-1" } as any)}>
                  <p {...({ className: "text-slate-500" } as any)}># Last checked: {new Date().toLocaleTimeString()}</p>
                  <p {...({ className: "text-blue-400" } as any)}>mysql> SHOW PROCESSLIST;</p>
                  <p>| Id | User | Host | db | Command | Time | State | Info |</p>
                  <p>|----|------|------|----|---------|------|-------|------|</p>
                  <p>| 42 | user | 10.0.1.5 | trade | Sleep | 150 | | NULL |</p>
                  <p>| 43 | root | 127.0.0.1 | trade | Query | 0 | Init | SHOW PROCESSLIST |</p>
                  <p {...({ className: "text-blue-400 mt-4" } as any)}>mysql> SELECT count(*) FROM order_info WHERE status='PROCESSING';</p>
                  <p {...({ className: "text-white font-bold" } as any)}>5 rows in set (0.01 sec)</p>
                  <p {...({ className: "mt-4 animate-pulse text-slate-700" } as any)}>_</p>
                </div>
              </div>
              <p {...({ className: "text-xs text-slate-400 italic" } as any)}>注：此页面模拟了阿里云数据库代理控制台，用于演示系统底层数据的实时交互。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
