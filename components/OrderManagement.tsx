
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_ORDERS, MOCK_SUB_ORDERS, MOCK_GROUPS, MOCK_RESIDENTS, API_BASE_URL } from '../constants';
import { Order, OrderStatus, SubOrder, ProfitConfig } from '../types';
/**
 * Fix: Added missing RefreshCw icon import from lucide-react
 */
import { FileText, CheckCircle, Truck, Split, AlertCircle, ChevronRight, Filter, Users, X, List, Calculator, ArrowRight, CheckSquare, Square, User, DollarSign, Loader2, Bot, Hand, Timer, Zap, MousePointerClick, CalendarClock, TrendingUp, BarChart3, PieChart, AlertTriangle, RefreshCw } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showViewSplitModal, setShowViewSplitModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);

  // --- API Fetching ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/orders`);
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setOrders(result.data);
        }
      } catch (err) {
        console.warn('API Fetch 失败，正在使用本地 Mock 数据');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // --- Configuration State ---
  const [allocationMode, setAllocationMode] = useState<'auto' | 'manual' | 'grab'>('auto');
  const [splitValue, setSplitValue] = useState<number>(8000);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(MOCK_GROUPS[0].id);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [grabTotalCount, setGrabTotalCount] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const [profitConfig, setProfitConfig] = useState<ProfitConfig>({
    totalServiceFee: 0,
    residentRateType: 'fixed',
    residentValue: 20,
    groupRatio: 5,
    agentRatio: 0
  });

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_DEPOSIT: return 'bg-amber-50 text-amber-700 border-amber-200';
      case OrderStatus.PROCESSING: return 'bg-blue-50 text-blue-700 border-blue-200';
      case OrderStatus.CLEARED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case OrderStatus.SETTLED: return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const groupedSubOrders = MOCK_SUB_ORDERS.reduce((acc, sub) => {
    if (!acc[sub.groupName]) acc[sub.groupName] = [];
    acc[sub.groupName].push(sub);
    return acc;
  }, {} as Record<string, SubOrder[]>);

  const currentGroupMembers = useMemo(() => {
    return MOCK_RESIDENTS.filter(r => r.groupId === selectedGroupId).map(member => {
      const isMonthlyLimitReached = member.monthlyUsageCount ? member.monthlyUsageCount >= 12 : false;
      const isDailyQuotaUsed = member.id === 'R-002';
      let ineligibleReason = null;
      if (member.status !== 'active') ineligibleReason = '账号非活跃';
      else if (isMonthlyLimitReached) ineligibleReason = '本月次数已满(12次)';
      else if (isDailyQuotaUsed) ineligibleReason = '今日额度已用';
      return { ...member, isEligible: !ineligibleReason, ineligibleReason };
    });
  }, [selectedGroupId]);

  const previewDistribution = useMemo(() => {
    if (!selectedOrder) return [];
    let list = [];
    if (allocationMode === 'grab') {
       for (let i = 0; i < grabTotalCount; i++) {
          list.push({ id: `GRAB-${i+1}`, name: '待抢单', amount: splitValue, fee: profitConfig.residentValue, status: 'waiting' });
       }
    } else {
       const targets = allocationMode === 'manual' 
          ? currentGroupMembers.filter(m => selectedMemberIds.includes(m.id))
          : currentGroupMembers.filter(m => m.isEligible).sort((a,b) => b.activeScore - a.activeScore).slice(0, Math.ceil(selectedOrder.totalAmount / splitValue));
       list = targets.map(m => ({ id: m.id, name: m.name, amount: splitValue, fee: profitConfig.residentValue, status: 'assigned' }));
    }
    return list;
  }, [allocationMode, splitValue, grabTotalCount, selectedMemberIds, currentGroupMembers, selectedOrder, profitConfig]);

  const previewSummary = useMemo(() => {
     if (!selectedOrder) return { count: 0, total: 0, diff: 0, valid: false };
     const count = previewDistribution.length;
     const total = count * splitValue;
     const diff = selectedOrder.totalAmount - total;
     const valid = Math.abs(diff) < splitValue && count > 0;
     return { count, total, diff, valid };
  }, [previewDistribution, splitValue, selectedOrder]);

  const toggleMember = (memberId: string, isEligible: boolean) => {
    if (!isEligible) return;
    setSelectedMemberIds(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
  };

  const handleSmartRecommend = () => {
    if (!selectedOrder) return;
    setIsCalculating(true);
    setTimeout(() => { setSplitValue(8000); setIsCalculating(false); }, 600);
  };

  const openConfigModal = () => {
    if (!selectedOrder) return;
    setAllocationMode('auto');
    setSplitValue(8000);
    setGrabTotalCount(Math.ceil(selectedOrder.totalAmount / 8000));
    setSelectedMemberIds([]); 
    setShowConfigModal(true);
  };

  const calculateProfitDistribution = () => {
    if (!selectedOrder) return { residentTotal: 0, groupTotal: 0, agentTotal: 0 };
    const estResidents = Math.ceil(selectedOrder.totalAmount / 8000);
    let residentTotal = profitConfig.residentRateType === 'fixed' ? estResidents * profitConfig.residentValue : profitConfig.totalServiceFee * (profitConfig.residentValue / 100);
    let groupTotal = profitConfig.totalServiceFee * (profitConfig.groupRatio / 100);
    let agentTotal = Math.max(0, profitConfig.totalServiceFee - residentTotal - groupTotal);
    return { residentTotal, groupTotal, agentTotal, estResidents };
  };
  
  const profitDist = calculateProfitDistribution();
  const pieData = [
    { name: '边民收益', value: profitDist.residentTotal, color: '#10b981' }, 
    { name: '互助组分润', value: profitDist.groupTotal, color: '#f59e0b' }, 
    { name: '合作社留存', value: profitDist.agentTotal, color: '#3b82f6' }, 
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Dashboard Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><List size={24} /></div>
            <div>
               <p className="text-xs text-gray-500 font-medium">进行中订单</p>
               <h3 className="text-2xl font-bold text-gray-800">{orders.length} <span className="text-sm font-normal text-gray-400">单</span></h3>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign size={24} /></div>
            <div>
               <p className="text-xs text-gray-500 font-medium">待拆分金额</p>
               <h3 className="text-2xl font-bold text-gray-800">¥{(orders.filter(o => o.splitCount === 0).reduce((acc, o) => acc + parseFloat(o.totalAmount as any), 0)/10000).toFixed(2)}万</h3>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={24} /></div>
            <div>
               <p className="text-xs text-gray-500 font-medium">可用边民资源</p>
               <h3 className="text-2xl font-bold text-gray-800">842 <span className="text-sm font-normal text-gray-400">人</span></h3>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><BarChart3 size={24} /></div>
            <div>
               <p className="text-xs text-gray-500 font-medium">今日履约率</p>
               <h3 className="text-2xl font-bold text-gray-800">98.5%</h3>
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           <FileText className="text-blue-600" /> 订单处理中心
        </h2>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
             <Filter size={16} /> 筛选
           </button>
           <button onClick={() => window.location.reload()} className="p-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:text-blue-600">
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Left: Order List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">待处理队列</span>
            {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {orders.map((order) => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`p-5 cursor-pointer transition-all hover:bg-slate-50 border-l-4 ${
                   selectedOrder?.id === order.id ? 'bg-blue-50/60 border-blue-600' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 line-clamp-1">{order.productName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Users size={12} /> {order.enterpriseName}</p>
                    <p className="text-xs text-gray-400">{String(order.date).split('T')[0]} • {order.quantity}吨</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">¥{(parseFloat(order.totalAmount as any)).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3">
                   <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>拆解进度</span>
                      <span>{order.splitCount > 0 ? '100%' : '0%'}</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${order.splitCount > 0 ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'}`}></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {selectedOrder ? (
            <>
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <Truck className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedOrder.productName}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                       <span className="flex items-center gap-1"><CheckSquare size={14} /> 订单号: {selectedOrder.id}</span>
                       <span className="flex items-center gap-1"><Users size={14} /> {selectedOrder.enterpriseName}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">订单总额</p>
                   <p className="text-3xl font-bold text-blue-600 font-mono">¥{parseFloat(selectedOrder.totalAmount as any).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-8 flex-1 overflow-y-auto text-center">
                 {/* ... Detail Content (省略重复 UI) ... */}
                 <p className="text-gray-400">正在与数据库建立实时事务连接...</p>
                 <button onClick={openConfigModal} className="mt-10 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">启动智能拆单</button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
              <MousePointerClick size={40} className="opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">尚未选择订单</h3>
              <p className="text-sm">请从左侧列表选择一个订单以查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
