
import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ShoppingBag, Info, ArrowRightLeft, X, FileText, Calendar, Coins, Briefcase, MapPin, Users, CheckCircle, ShieldCheck, UserCheck, Phone, AlertCircle } from 'lucide-react';
import { MOCK_COMMODITIES, MOCK_LABOR_DEMANDS, MOCK_RESIDENTS } from '../constants';
import { Commodity, LaborDemand } from '../types';

const getOriginFlag = (origin: string) => {
  if (origin.includes('越南')) return '🇻🇳';
  if (origin.includes('缅甸')) return '🇲🇲';
  if (origin.includes('老挝')) return '🇱🇦';
  if (origin.includes('泰国')) return '🇹🇭';
  return '🌐';
};

export const MarketView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goods' | 'labor'>('goods');
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- Labor Apply State ---
  const [selectedLabor, setSelectedLabor] = useState<LaborDemand | null>(null);
  const [showLaborApplyModal, setShowLaborApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaderName: '岩帕',
    leaderPhone: '139****8888',
    selectedWorkerIds: [] as string[],
    hasInsurance: false,
    hasTraining: false
  });

  // Procurement Form states
  const [intentionQty, setIntentionQty] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<string>('');
  
  const handlePurchaseClick = (item: Commodity) => {
    setSelectedCommodity(item);
    setIntentionQty(10); // default
    setShowModal(true);
  };

  const handleSubmitIntention = () => {
    alert('采购意向已提交！系统将自动为您匹配相关互助组资源。');
    setShowModal(false);
  };

  const handleLaborApply = (labor: LaborDemand) => {
    setSelectedLabor(labor);
    setApplyForm(prev => ({ ...prev, selectedWorkerIds: [] })); // Reset workers
    setShowLaborApplyModal(true);
  };

  const toggleWorkerSelection = (workerId: string) => {
    setApplyForm(prev => {
      const newIds = prev.selectedWorkerIds.includes(workerId)
        ? prev.selectedWorkerIds.filter(id => id !== workerId)
        : [...prev.selectedWorkerIds, workerId];
      return { ...prev, selectedWorkerIds: newIds };
    });
  };

  const handleSubmitLaborApplication = () => {
    if (applyForm.selectedWorkerIds.length === 0) {
      alert("请至少选择一名边民加入施工队！");
      return;
    }
    if (!applyForm.hasInsurance || !applyForm.hasTraining) {
      alert("请确认已落实保险与安全培训要求！");
      return;
    }
    
    alert(`报名成功！\n\n已向【${selectedLabor?.enterpriseName}】提交 ${applyForm.selectedWorkerIds.length} 人施工名单。\n请通知队员按时集合。`);
    setShowLaborApplyModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">互市大厅 (Marketplace)</h2>
          <p className="text-gray-500 text-sm mt-1">实时商品行情与劳务需求撮合</p>
        </div>
        
        {/* Toggle Goods / Labor */}
        <div className="flex p-1 bg-gray-200 rounded-lg">
           <button 
             onClick={() => setActiveTab('goods')}
             className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                activeTab === 'goods' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             商品交易
           </button>
           <button 
             onClick={() => setActiveTab('labor')}
             className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1 ${
                activeTab === 'labor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
           >
             <Briefcase size={14} /> 劳务服务
           </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={activeTab === 'goods' ? "搜索商品名称或产地..." : "搜索工种或企业..."}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      {activeTab === 'goods' ? (
      <>
      {/* Market Indices / Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
          <p className="text-blue-100 text-xs font-medium uppercase">Border Trade Index</p>
          <h3 className="text-2xl font-bold mt-1">边贸价格指数</h3>
          <div className="flex items-center gap-2 mt-3">
             <span className="text-3xl font-bold">1,245.8</span>
             <span className="bg-white/20 px-2 py-0.5 rounded text-sm flex items-center">
               <TrendingUp size={14} className="mr-1" /> +0.5%
             </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center">
           <h4 className="font-semibold text-gray-800 mb-2">热门品类交易占比</h4>
           <div className="flex gap-2 text-sm mt-2 flex-wrap">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">坚果 45%</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">水产 30%</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">粮油 15%</span>
           </div>
        </div>

        {/* Currency Exchange Rates (New) */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-3">
               <h4 className="font-semibold text-gray-800">货币互换汇率</h4>
               <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">实时</span>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-gray-600">CNY</span>
                     <ArrowRightLeft size={14} className="text-gray-400" />
                     <span className="text-sm font-bold text-gray-600">VND</span>
                  </div>
                  <div className="text-right">
                     <span className="font-bold text-gray-800 block leading-none">3,420.5</span>
                     <span className="text-[10px] text-green-500 font-medium">↑ 0.15%</span>
                  </div>
               </div>
               <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-gray-600">CNY</span>
                     <ArrowRightLeft size={14} className="text-gray-400" />
                     <span className="text-sm font-bold text-gray-600">MMK</span>
                  </div>
                  <div className="text-right">
                     <span className="font-bold text-gray-800 block leading-none">295.8</span>
                     <span className="text-[10px] text-red-500 font-medium">↓ 1.20%</span>
                  </div>
               </div>
            </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 text-orange-800 flex items-center justify-between">
           <div>
             <h4 className="font-bold">今日休市提醒</h4>
             <p className="text-xs mt-1">越南海关系统维护，生鲜类通关稍有延迟。</p>
           </div>
           <Info size={24} className="opacity-50" />
        </div>
      </div>

      {/* Commodity Grid */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-lg">今日挂牌商品</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_COMMODITIES.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                 <img 
                   src={item.image} 
                   alt={item.name} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-gray-600 border border-gray-200 shadow-sm flex items-center gap-1">
                   <span>{getOriginFlag(item.origin)}</span>
                   {item.origin}
                 </div>
                 <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                   {item.category}
                 </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                  <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                    item.trend === 'up' ? 'bg-red-50 text-red-600' : item.trend === 'down' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {item.trend === 'up' && <TrendingUp size={12} className="mr-1" />}
                    {item.trend === 'down' && <TrendingDown size={12} className="mr-1" />}
                    {item.trend === 'stable' && <Minus size={12} className="mr-1" />}
                    {item.changeRate > 0 ? '+' : ''}{item.changeRate}%
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-gray-500">指导价</p>
                    <p className="text-xl font-bold text-blue-600">¥{item.price}<span className="text-sm font-normal text-gray-500">/{item.unit}</span></p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-gray-500">今日可供</p>
                     <p className="font-medium text-gray-800">{item.stock} {item.unit}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handlePurchaseClick(item)}
                    className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                  >
                    加入采购意向
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      ) : (
      <>
        {/* Labor Services View */}
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 flex items-start gap-4">
           <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <Briefcase size={24} />
           </div>
           <div>
              <h3 className="text-lg font-bold text-emerald-800">劳务助农增收</h3>
              <p className="text-sm text-emerald-700 mt-1 max-w-2xl">
                 为边民提供装卸、搬运、理货等合规劳务机会。合作社统一组织对接，保障劳动权益，增加边民收入。
              </p>
           </div>
        </div>

        <div>
           <h3 className="font-bold text-gray-800 mb-4 text-lg">今日热门用工需求</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_LABOR_DEMANDS.map(item => (
                 <div key={item.id} className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col group overflow-hidden">
                    <div className="p-5 border-b border-gray-50">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h4 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                             <p className="text-xs text-gray-500 mt-1">{item.enterpriseName}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                             item.status === 'hiring' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                             {item.status === 'hiring' ? '招聘中' : '已满员'}
                          </span>
                       </div>
                       
                       <div className="mt-4 flex flex-wrap gap-2">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-100">
                             {item.wage}
                          </span>
                          <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs border border-gray-100">
                             {item.peopleCount}人
                          </span>
                          <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs border border-gray-100">
                             {item.type === 'loading' ? '装卸' : item.type === 'sorting' ? '分拣' : item.type === 'tallying' ? '理货' : '其他'}
                          </span>
                       </div>
                    </div>
                    
                    <div className="p-5 flex-1 space-y-3 bg-gray-50/30">
                       <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar size={14} className="text-gray-400" /> 
                          <span>{item.workDate} {item.workTime}</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin size={14} className="text-gray-400" /> 
                          <span>{item.location}</span>
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle size={14} className="text-emerald-500" /> 
                          <span>已通过劳动法合规校验</span>
                       </div>
                       <p className="text-xs text-gray-500 mt-2 line-clamp-2 bg-white p-2 rounded border border-gray-100">
                          要求: {item.requirements}
                       </p>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                       <button 
                         onClick={() => handleLaborApply(item)}
                         disabled={item.status !== 'hiring'}
                         className={`w-full py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                            item.status === 'hiring' 
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                         }`}
                       >
                          {item.status === 'hiring' ? <><Users size={16} /> 合作社统一报名</> : '已结束'}
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </>
      )}

      {/* Procurement Intention Modal (Original) */}
      {showModal && selectedCommodity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" /> 采购意向申报
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Info Summary */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                 <img src={selectedCommodity.image} alt={selectedCommodity.name} className="w-16 h-16 rounded-md object-cover" />
                 <div>
                    <h4 className="font-bold text-gray-800">{selectedCommodity.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">产地: {selectedCommodity.origin} | 类别: {selectedCommodity.category}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">¥{selectedCommodity.price} / {selectedCommodity.unit}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">意向采购数量 ({selectedCommodity.unit})</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={intentionQty}
                         onChange={(e) => setIntentionQty(Number(e.target.value))}
                         className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {selectedCommodity.unit}
                       </span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">期望交付日期</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         type="date" 
                         value={targetDate}
                         onChange={(e) => setTargetDate(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">备注说明</label>
                    <textarea 
                      placeholder="如有特殊包装要求或指定口岸，请在此说明..." 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
                    ></textarea>
                 </div>
              </div>

              {/* Estimation */}
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
                 <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                    <Coins size={16} /> 预估总金额
                 </div>
                 <div className="text-xl font-bold text-blue-800">
                    ¥{(intentionQty * selectedCommodity.price).toLocaleString()}
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  取消
               </button>
               <button onClick={handleSubmitIntention} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-colors">
                  提交意向
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: Labor Application Modal --- */}
      {showLaborApplyModal && selectedLabor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-scale-in backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-emerald-50 flex justify-between items-center">
                 <div>
                    <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                       <Briefcase size={22} className="text-emerald-600" /> 劳务报名对接
                    </h3>
                    <p className="text-xs text-emerald-700 mt-1">合作社统一组织 • 劳动权益保障</p>
                 </div>
                 <button onClick={() => setShowLaborApplyModal(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
                 
                 {/* 1. Job Summary */}
                 <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="font-bold text-gray-800 text-lg">{selectedLabor.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                             <Users size={14} /> {selectedLabor.enterpriseName}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-bold text-emerald-600">{selectedLabor.wage}</p>
                          <p className="text-xs text-gray-400 mt-1">招募 {selectedLabor.peopleCount} 人</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400"/> {selectedLabor.workDate}</div>
                       <div className="flex items-center gap-2"><Briefcase size={14} className="text-gray-400"/> {selectedLabor.workTime}</div>
                       <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> {selectedLabor.location}</div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
                       <Info size={14} className="shrink-0 mt-0.5" />
                       <span className="leading-relaxed">任职要求：{selectedLabor.requirements}</span>
                    </div>
                 </div>

                 {/* 2. Team Organization */}
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                       <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                          <Users size={16} className="text-blue-500" /> 组织施工队名单
                       </h4>
                       <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                          已选 {applyForm.selectedWorkerIds.length} 人
                       </span>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto p-2">
                       {MOCK_RESIDENTS.map((resident) => {
                          const isSelected = applyForm.selectedWorkerIds.includes(resident.id);
                          return (
                             <div 
                                key={resident.id}
                                onClick={() => toggleWorkerSelection(resident.id)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border mb-2 last:mb-0 ${
                                   isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-gray-300'
                                }`}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                      {isSelected && <CheckCircle size={14} className="text-white" />}
                                   </div>
                                   <img src={resident.avatar} className="w-8 h-8 rounded-full bg-gray-200" />
                                   <div>
                                      <p className="font-bold text-sm text-gray-800">{resident.name}</p>
                                      <p className="text-xs text-gray-400">{resident.id} • {resident.status === 'active' ? '活跃' : '休息'}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <span className={`text-[10px] px-2 py-0.5 rounded ${resident.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                      {resident.status === 'active' ? '可派工' : '不可用'}
                                   </span>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* 3. Compliance & Contact */}
                 <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                       <ShieldCheck size={16} className="text-purple-500" /> 领队与合规确认
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="text-xs text-gray-500 mb-1 block">现场领队姓名</label>
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-gray-50">
                             <UserCheck size={16} className="text-gray-400" />
                             <input 
                               type="text" 
                               value={applyForm.leaderName}
                               onChange={e => setApplyForm({...applyForm, leaderName: e.target.value})}
                               className="bg-transparent outline-none text-sm w-full font-bold text-gray-700"
                             />
                          </div>
                       </div>
                       <div>
                          <label className="text-xs text-gray-500 mb-1 block">领队联系电话</label>
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-gray-50">
                             <Phone size={16} className="text-gray-400" />
                             <input 
                               type="text" 
                               value={applyForm.leaderPhone}
                               onChange={e => setApplyForm({...applyForm, leaderPhone: e.target.value})}
                               className="bg-transparent outline-none text-sm w-full font-bold text-gray-700"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div 
                         onClick={() => setApplyForm(prev => ({...prev, hasInsurance: !prev.hasInsurance}))}
                         className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                       >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${applyForm.hasInsurance ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                             {applyForm.hasInsurance && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <span className="text-xs text-gray-600">我承诺所有队员已购买意外伤害保险 (团体险)</span>
                       </div>
                       <div 
                         onClick={() => setApplyForm(prev => ({...prev, hasTraining: !prev.hasTraining}))}
                         className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                       >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${applyForm.hasTraining ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                             {applyForm.hasTraining && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <span className="text-xs text-gray-600">我确认已对队员进行岗前安全教育培训</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center shadow-lg z-10">
                 <div className="text-xs text-gray-500">
                    已选 <b className="text-blue-600 text-base">{applyForm.selectedWorkerIds.length}</b> 人
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setShowLaborApplyModal(false)} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                       取消
                    </button>
                    <button 
                       onClick={handleSubmitLaborApplication}
                       className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                    >
                       确认报名名单 <ArrowRightLeft size={16} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
