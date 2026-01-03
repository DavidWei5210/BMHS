
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_RESIDENT_PROFILE, MOCK_INCOME_HISTORY, MOCK_GROUPS, MOCK_INVOICES, MOCK_DAILY_REPORTS, MOCK_SETTLEMENTS, MOCK_SUB_ORDERS, MOCK_RESIDENTS } from '../constants';
import { ResidentLevel, ResidentProfile } from '../types';
import { Medal, TrendingUp, Users, ShoppingBag, LayoutDashboard, ListOrdered, UserCircle, CheckCircle2, ScanFace, AlertCircle, Calculator, Percent, Coins, FileText, Upload, RefreshCw, Printer, Table, Building2, Search, ShieldCheck, TrendingDown, Minus, Server, Link2, Camera, Image as ImageIcon, X, ChevronRight, PieChart, Calendar, Wallet, Share2, Copy, QrCode, UserPlus, Settings, Megaphone, UserMinus, UserCheck, Zap, ArrowRight, Loader2, ScanLine, AlertTriangle, Network, GitFork, MessageCircle, Home, Users as UsersIcon, Banknote, Lock, Smartphone, ToggleLeft, ToggleRight, Fingerprint } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { ResidentAuth } from './ResidentAuth';

// Chart Data (Mock)
const chartData = [
  { name: '1月', income: 2400 },
  { name: '2月', income: 2800 },
  { name: '3月', income: 3200 },
  { name: '4月', income: 3000 },
  { name: '5月', income: 3800 },
  { name: '6月', income: 4200 },
  { name: '7月', income: 4500 },
];

const incomeBreakdownData = [
  { name: '互市贸易', value: 3800, color: '#3b82f6' },
  { name: '互助分红', value: 500, color: '#f59e0b' },
  { name: '政策补贴', value: 200, color: '#10b981' },
];

const MOCK_TEAM_MEMBERS = {
  level1: [
    { id: 'TM-001', name: '岩光', contribution: 450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=岩光' },
    { id: 'TM-002', name: '咪依', contribution: 280, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=咪依' },
    { id: 'TM-003', name: '波温', contribution: 120, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=波温' },
  ]
};

const getLevelColor = (level: ResidentLevel) => {
  switch (level) {
    case ResidentLevel.ORDINARY: return 'bg-gray-100 text-gray-600 border-gray-200';
    case ResidentLevel.BRONZE: return 'bg-orange-50 text-orange-700 border-orange-200';
    case ResidentLevel.SILVER: return 'bg-slate-100 text-slate-700 border-slate-200';
    case ResidentLevel.GOLD: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case ResidentLevel.PARTNER: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

// PDF架构对应模块
// 模块一：身份认证 (ResidentAuth)
// 模块二：交易中心 (TradeCenter) - 额度、申报、资金
// 模块三：收益中心 (ProfitCenter) - 明细、奖励
// 模块四：社交裂变 (SocialFission) -> 我的团队 (MyTeam) - 推荐、社群
// 模块五：个人中心 (PersonalCenter) - 团队、设置

type ModuleTab = 'trade' | 'profit' | 'social' | 'profile' | 'auth';

export const ResidentCenter: React.FC<{view: string}> = ({ view }) => {
  // Navigation State
  const [activeModule, setActiveModule] = useState<ModuleTab>('trade');
  
  // Profile State
  const [profile, setProfile] = useState<ResidentProfile>(MOCK_RESIDENT_PROFILE);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [taskConfirmed, setTaskConfirmed] = useState(false);
  const [portVerifying, setPortVerifying] = useState(false);
  
  // Alert State
  const [showQuotaAlert, setShowQuotaAlert] = useState(false);
  
  // Security Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(() => localStorage.getItem('biometricEnabled') === 'true');

  // Constants
  const MONTHLY_FREQ_LIMIT = 12;
  const remainingGrabs = MONTHLY_FREQ_LIMIT - (profile.monthlyUsageCount || 0);
  const currentGroup = MOCK_GROUPS.find(g => g.id === profile.groupId);

  // --- Effects ---
  useEffect(() => {
    // Check quota usage when profile loads or updates
    if (profile.monthlyUsageCount && profile.monthlyUsageCount >= 7 && profile.monthlyUsageCount < MONTHLY_FREQ_LIMIT) {
      setShowQuotaAlert(true);
    }
  }, [profile.monthlyUsageCount]);

  // --- Handlers (Simplified for brevity) ---
  const handleFaceConfirm = () => {
    setShowFaceScan(true);
    setTimeout(() => {
      setShowFaceScan(false);
      setPortVerifying(true);
      setTimeout(() => {
        setPortVerifying(false);
        setTaskConfirmed(true);
        // Simulate updating usage count
        setProfile(prev => ({
            ...prev,
            monthlyUsageCount: (prev.monthlyUsageCount || 0) + 1
        }));
      }, 1500);
    }, 1500);
  };

  const handleToggleBiometric = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    localStorage.setItem('biometricEnabled', String(newValue));
    if (newValue) {
       // Ideally trigger a face scan to confirm, here just alert
       alert('生物识别登录已开启！下次登录可直接使用人脸或指纹。');
    }
  };

  const handleChangePassword = () => {
    // Simple prompt for demo
    const oldPass = prompt("请输入当前密码");
    if (oldPass) {
        const newPass = prompt("请输入新密码 (6位以上)");
        if (newPass && newPass.length >= 6) {
            alert("密码修改成功！请牢记您的新密码。");
        } else if (newPass) {
            alert("密码长度不足，修改失败。");
        }
    }
  };

  // --- Render Helpers ---
  const renderBottomNav = () => (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between z-40 md:hidden">
       {[
         { id: 'trade', label: '交易中心', icon: ShoppingBag },
         { id: 'profit', label: '收益中心', icon: Wallet },
         { id: 'social', label: '我的团队', icon: UsersIcon },
         { id: 'profile', label: '个人中心', icon: UserCircle },
       ].map(item => (
         <button 
           key={item.id}
           onClick={() => setActiveModule(item.id as ModuleTab)}
           className={`flex flex-col items-center gap-1 ${activeModule === item.id ? 'text-blue-600' : 'text-gray-400'}`}
         >
            <item.icon size={24} strokeWidth={activeModule === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
         </button>
       ))}
    </div>
  );

  // --- VIEW 1: 交易中心 (Trade Center) ---
  const TradeCenter = () => (
    <div className="space-y-6 pb-20">
       {/* 1. Quota Management (额度管理) */}
       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-blue-200 text-xs font-medium uppercase">今日可用免税额度</p>
                   <h3 className="text-4xl font-bold mt-1">¥{taskConfirmed ? '0' : '8,000'}</h3>
                </div>
                <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                   剩余 {remainingGrabs} 次/月
                </div>
             </div>
             
             {/* Progress Bar */}
             <div className="mt-6">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                   <span>额度恢复倒计时</span>
                   <span>14:22:05</span>
                </div>
                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                   <div className="h-full bg-green-400 w-2/3"></div>
                </div>
             </div>
          </div>
          <Zap className="absolute -right-6 -bottom-6 text-white/10" size={140} />
       </div>

       {/* 2. Declare Action (采购申报) */}
       {!taskConfirmed ? (
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
               <ShoppingBag size={18} className="text-blue-600" /> 待确认申报单
            </h3>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
               <img src="https://images.unsplash.com/photo-1536591375315-1988d6960991?auto=format&fit=crop&q=80&w=100" className="w-16 h-16 rounded-md object-cover" />
               <div className="flex-1">
                  <h4 className="font-bold text-gray-800">越南去皮干腰果</h4>
                  <p className="text-xs text-gray-500 mt-1">鑫源坚果加工有限公司采购</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">申报金额: ¥8,000</p>
               </div>
            </div>
            <button 
              onClick={handleFaceConfirm}
              disabled={showFaceScan || portVerifying}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-md shadow-blue-200"
            >
               {showFaceScan ? '人脸识别中...' : portVerifying ? '海关数据同步中...' : '一键人脸确认申报'}
            </button>
         </div>
       ) : (
         <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-3">
               <CheckCircle2 size={32} />
            </div>
            <h3 className="font-bold text-green-800 text-lg">今日申报已完成</h3>
            <p className="text-green-600 text-xs mt-1">流水号: H20231026-88291 (已上链)</p>
         </div>
       )}

       {/* 3. Funds (资金管理) */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Wallet size={18} className="text-indigo-600" /> 资金账户
             </h3>
             <span className="text-xs text-gray-400">银行托管</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
             <div className="p-5 text-center">
                <p className="text-xs text-gray-500 mb-1">收益账户 (可提现)</p>
                <p className="text-xl font-bold text-green-600">¥124.50</p>
             </div>
             <div className="p-5 text-center">
                <p className="text-xs text-gray-500 mb-1">本金账户 (额度归还)</p>
                <p className="text-xl font-bold text-gray-800">¥0.00</p>
             </div>
          </div>
          <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
             <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> 银行授信额度: ¥20,000 (状态: 正常)
             </p>
          </div>
       </div>
    </div>
  );

  // --- VIEW 2: 收益中心 (Profit Center) ---
  const ProfitCenter = () => (
    <div className="space-y-6 pb-20">
       <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-xs font-medium uppercase">本月累计收益</p>
          <h3 className="text-4xl font-bold text-gray-800 mt-2">¥{profile.monthEarnings}</h3>
          <div className="flex justify-center gap-2 mt-4">
             <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                基础收益 ¥2,400
             </span>
             <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                奖励收益 ¥50
             </span>
          </div>
       </div>

       {/* Chart */}
       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="font-bold text-gray-800 text-sm mb-4">收益构成分析</h4>
          <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                   <Pie data={incomeBreakdownData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      {incomeBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                   </Pie>
                   <Tooltip />
                </RePieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
             {incomeBreakdownData.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-gray-600">{item.name}</span>
                   </div>
                   <span className="font-bold text-gray-800">¥{item.value}</span>
                </div>
             ))}
          </div>
       </div>

       {/* History List */}
       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
             <h4 className="font-bold text-gray-800 text-sm">近期收益明细</h4>
          </div>
          <div className="divide-y divide-gray-100">
             {MOCK_INCOME_HISTORY.map(r => (
                <div key={r.id} className="p-4 flex justify-between items-center">
                   <div>
                      <p className="font-bold text-gray-800 text-sm">{r.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                   </div>
                   <span className="font-bold text-green-600">+¥{r.amount}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  // --- VIEW 3: 我的团队 (My Team - formerly Social Fission) ---
  const SocialFission = () => (
    <div className="space-y-6 pb-20">
       <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
          <div>
             <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20} /> 邀请赚收益</h3>
             <p className="text-pink-100 text-xs mt-1">每邀请一名新边民，享交易额 0.1% 奖励</p>
             <div className="mt-4 bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                <span className="font-mono font-bold tracking-widest">882910</span>
                <Copy size={12} className="cursor-pointer hover:text-pink-200" />
             </div>
          </div>
          <div className="bg-white p-2 rounded-lg">
             <QrCode className="text-slate-800" size={64} />
          </div>
       </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
             <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Network size={16} className="text-blue-600" /> 我的推荐网络
             </h4>
             <span className="text-xs text-gray-500">团队: {profile.referralCount} 人</span>
          </div>
          {/* Simple Tree View Simulation */}
          <div className="p-5">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5">
                   <img src={profile.avatar} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                   <p className="font-bold text-gray-800 text-sm">我 (根节点)</p>
                   <p className="text-xs text-blue-600">总收益: ¥{profile.monthEarnings}</p>
                </div>
             </div>
             
             <div className="border-l-2 border-dashed border-gray-200 ml-5 pl-5 space-y-4">
                {MOCK_TEAM_MEMBERS.level1.map(m => (
                   <div key={m.id} className="relative">
                      <div className="absolute -left-[22px] top-3 w-4 h-0.5 bg-gray-200"></div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div className="flex items-center gap-3">
                            <img src={m.avatar} className="w-8 h-8 rounded-full bg-white" />
                            <div>
                               <p className="font-bold text-gray-700 text-xs">{m.name}</p>
                               <span className="text-[10px] text-gray-400">直接推荐</span>
                            </div>
                         </div>
                         <span className="text-xs font-bold text-green-600">+¥{m.contribution}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  // --- VIEW 4: 个人中心 (Personal Center) ---
  const PersonalCenter = () => (
    <div className="space-y-6 pb-20">
       <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <img src={profile.avatar} className="w-16 h-16 rounded-full border-2 border-gray-100" />
          <div className="flex-1">
             <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                {profile.name}
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getLevelColor(profile.level)}`}>
                   {profile.level}
                </span>
             </h3>
             <p className="text-xs text-gray-400 mt-1">ID: {profile.id} | {currentGroup?.name}</p>
          </div>
          <ChevronRight className="text-gray-300" />
       </div>

       {/* Invite Entry Card */}
       <div 
          onClick={() => setActiveModule('social')}
          className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-5 text-white shadow-lg cursor-pointer relative overflow-hidden group"
       >
          <div className="relative z-10 flex justify-between items-center">
             <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <UserPlus size={20} className="text-white" /> 邀请边民加入
                </h3>
                <p className="text-white/90 text-xs mt-1">
                   发展直接/间接推荐 • 赚取团队佣金
                </p>
             </div>
             <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <ChevronRight size={20} />
             </div>
          </div>
          {/* Decorative Background Icons */}
          <UsersIcon className="absolute -right-2 -bottom-4 text-white/10 w-24 h-24 rotate-12" />
       </div>

       {/* Module 1: Identity Auth (Embedded here) */}
       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
             身份认证与管理 (Module 1)
          </div>
          <div className="divide-y divide-gray-100">
             <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={18} /></div>
                   <span className="text-sm font-medium text-gray-700">实名认证</span>
                </div>
                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                   <CheckCircle2 size={12} /> 已认证
                </span>
             </div>
             <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Banknote size={18} /></div>
                   <span className="text-sm font-medium text-gray-700">银行卡绑定</span>
                </div>
                <span className="text-xs text-gray-400">尾号 8888</span>
             </div>
             <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building2 size={18} /></div>
                   <span className="text-sm font-medium text-gray-700">个体户资质</span>
                </div>
                <span className="text-xs text-blue-600 font-bold">查看执照</span>
             </div>
          </div>
       </div>

       {/* Settings */}
       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
             系统设置
          </div>
          <div className="divide-y divide-gray-100">
             <button 
                onClick={() => setShowSecurityModal(true)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Lock size={18} /></div>
                   <span className="text-sm font-medium text-gray-700">安全中心 (密码/生物识别)</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
             </button>
             <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><MessageCircle size={18} /></div>
                   <span className="text-sm font-medium text-gray-700">消息通知设置</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
             </button>
             <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 text-left text-red-600">
                <span className="text-sm font-medium pl-2">退出登录</span>
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:pb-0 relative">
       {/* Alert Modal */}
       {showQuotaAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden animate-scale-in">
                <div className="flex flex-col items-center text-center">
                   <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 animate-bounce">
                      <AlertTriangle size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 mb-2">额度预警提醒</h3>
                   <p className="text-gray-500 text-sm mb-4">
                      您的本月免税额度使用频次已达 <span className="text-amber-600 font-bold text-lg">{profile.monthlyUsageCount}</span> 次，
                      接近每月上限 ({MONTHLY_FREQ_LIMIT}次)。
                   </p>
                   <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                      <div 
                         className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                         style={{width: `${Math.min(100, (profile.monthlyUsageCount || 0) / MONTHLY_FREQ_LIMIT * 100)}%`}}
                      ></div>
                   </div>
                   <p className="text-xs text-gray-400 mb-6">剩余可用次数: {Math.max(0, MONTHLY_FREQ_LIMIT - (profile.monthlyUsageCount || 0))} 次</p>
                   
                   <button 
                      onClick={() => setShowQuotaAlert(false)}
                      className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors"
                   >
                      知道了
                   </button>
                </div>
             </div>
          </div>
       )}

       {/* Security Modal */}
       {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-blue-600" /> 安全中心
                   </h3>
                   <button onClick={() => setShowSecurityModal(false)} className="bg-white p-1.5 rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-200">
                      <X size={18} />
                   </button>
                </div>
                <div className="p-6 space-y-6">
                   
                   {/* Password */}
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Lock size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-gray-800">登录密码</p>
                            <p className="text-xs text-gray-400">建议定期修改，保障账户安全</p>
                         </div>
                      </div>
                      <button 
                         onClick={handleChangePassword}
                         className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                         修改
                      </button>
                   </div>

                   {/* Biometric */}
                   <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <div className="flex items-center gap-3">
                         <div className={`p-2.5 rounded-xl transition-colors ${biometricEnabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {biometricEnabled ? <ScanFace size={20} /> : <Fingerprint size={20} />}
                         </div>
                         <div>
                            <p className="font-bold text-gray-800">生物识别登录</p>
                            <p className="text-xs text-gray-400">使用 Face ID 或指纹快速登录</p>
                         </div>
                      </div>
                      <button 
                         onClick={handleToggleBiometric}
                         className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${biometricEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                   </div>

                   <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-600 leading-relaxed flex items-start gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <p>为了保障您的资金与信息安全，涉及大额资金转出时仍需验证交易密码或手机验证码。</p>
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* Mobile Header */}
       <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 md:hidden flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
             {activeModule === 'trade' && '交易中心'}
             {activeModule === 'profit' && '收益中心'}
             {activeModule === 'social' && '我的团队'}
             {activeModule === 'profile' && '个人中心'}
          </h2>
          <div className="flex gap-3">
             <MessageCircle size={20} className="text-gray-600" />
             <Settings size={20} className="text-gray-600" />
          </div>
       </div>

       {/* Main Content Area */}
       <div className="p-4 md:p-6 max-w-2xl mx-auto">
          {activeModule === 'trade' && <TradeCenter />}
          {activeModule === 'profit' && <ProfitCenter />}
          {activeModule === 'social' && <SocialFission />}
          {activeModule === 'profile' && <PersonalCenter />}
       </div>

       {/* Mobile Bottom Navigation */}
       {renderBottomNav()}
    </div>
  );
};
