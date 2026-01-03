
import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, Circle, Clock, RefreshCw, Database, Link, Shield, FileCheck, Anchor, Fingerprint, AlertOctagon } from 'lucide-react';
import { MOCK_LOGISTICS } from '../constants';

export const LogisticsView: React.FC = () => {
  const [record, setRecord] = useState(MOCK_LOGISTICS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'chain'>('chain');

  const handleSyncCustomsData = () => {
    setIsSyncing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsSyncing(false);
      // Simulate data update
      setRecord(prev => ({
        ...prev,
        steps: prev.steps.map(step => {
          if (step.title === '海关查验') return { ...step, status: 'completed' as const };
          if (step.title === '海关放行') return { ...step, status: 'current' as const, time: '10:45', description: '查验通过，单证放行' };
          return step;
        })
      }));
      alert('H2018监管数据同步成功！区块链存证已更新。');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">通关物流与溯源 (Logistics & Traceability)</h2>
          <p className="text-gray-500 text-sm mt-1">全流程可视化监管 • 区块链五流合一存证</p>
        </div>
        <div>
           <button 
             onClick={handleSyncCustomsData}
             disabled={isSyncing}
             className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}
           >
             <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
             {isSyncing ? '正在上链同步...' : '同步海关 H2018 数据'}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('chain')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'chain' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ⛓️ 数字证据链 (五流合一)
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🗺️ 电子围栏监控
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Content based on Tab */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Current Status Header */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold border border-blue-200">跨境车辆</span>
                   <h3 className="text-xl font-bold text-gray-800">{record.truckPlate}</h3>
                 </div>
                 <p className="text-sm text-gray-500">司机: {record.driver} | 承运: 越南干腰果 (50吨)</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400 mb-1">当前海关状态</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-green-700 text-lg">
                      {record.steps.find(s => s.status === 'current')?.title || '已完成'}
                    </span>
                 </div>
              </div>
           </div>

           {/* --- VIEW: BLOCKCHAIN TRACEABILITY --- */}
           {activeTab === 'chain' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Link size={18} className="text-indigo-500" /> 全链路真伪存证
                   </h3>
                   <span className="text-[10px] font-mono text-slate-400 bg-white border px-2 py-0.5 rounded">
                      Merkle Root: 0x8a7d...3f9c
                   </span>
                </div>
                
                <div className="p-8 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-100"></div>

                   <div className="space-y-8 relative">
                      {/* Step 1: Origin */}
                      <div className="flex gap-6">
                         <div className="w-16 flex-shrink-0 flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600">
                               <Anchor size={18} />
                            </div>
                         </div>
                         <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between mb-2">
                               <h4 className="font-bold text-slate-700">境外货源溯源</h4>
                               <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={12}/> 产地证已验真</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                               <p>采购地: 越南平福省</p>
                               <p>供货商: 越南T&T农业发展公司</p>
                               <p className="font-mono text-[10px] text-slate-400 col-span-2 mt-1">
                                  Hash: 7a91...2b1c (不可篡改)
                               </p>
                            </div>
                         </div>
                      </div>

                      {/* Step 2: Cross Border */}
                      <div className="flex gap-6">
                         <div className="w-16 flex-shrink-0 flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600">
                               <Truck size={18} />
                            </div>
                         </div>
                         <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between mb-2">
                               <h4 className="font-bold text-slate-700">跨境物流轨迹</h4>
                               <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={12}/> GPS数据吻合</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                               <p>入境口岸: 龙邦口岸</p>
                               <p>过磅重量: 50.02 吨</p>
                               <p className="font-mono text-[10px] text-slate-400 col-span-2 mt-1">
                                  Hash: c2b4...9e1f (不可篡改)
                               </p>
                            </div>
                         </div>
                      </div>

                      {/* Step 3: Resident Declare */}
                      <div className="flex gap-6">
                         <div className="w-16 flex-shrink-0 flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600">
                               <Fingerprint size={18} />
                            </div>
                         </div>
                         <div className="flex-1 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 hover:border-indigo-200 transition-colors">
                            <div className="flex justify-between mb-2">
                               <h4 className="font-bold text-indigo-900">互市申报 (五流合一)</h4>
                               <span className="text-xs text-indigo-600 font-bold bg-white px-2 py-0.5 rounded border border-indigo-100">核心证据</span>
                            </div>
                            <div className="space-y-2 text-xs text-indigo-800">
                               <div className="flex items-center gap-2">
                                 <FileCheck size={12} />
                                 <span>265人 订单拆分协议 (已签署)</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Fingerprint size={12} />
                                 <span>265人 生物活体识别日志 (已存证)</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Database size={12} />
                                 <span>银行代扣代付流水 (匹配成功)</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Step 4: Factory Entry */}
                      <div className="flex gap-6">
                         <div className="w-16 flex-shrink-0 flex flex-col items-center gap-2 z-10">
                            <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-600">
                               <Database size={18} />
                            </div>
                         </div>
                         <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between mb-2">
                               <h4 className="font-bold text-slate-700">加工厂入库核销</h4>
                               <span className="text-xs text-gray-400">待完成</span>
                            </div>
                            <p className="text-xs text-slate-400">货物进入加工区电子围栏后自动触发...</p>
                         </div>
                      </div>

                   </div>
                </div>
             </div>
           )}

           {/* --- VIEW: GIS MAP --- */}
           {activeTab === 'map' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 h-[500px] relative overflow-hidden">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-slate-100" style={{
                   backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.3,23.4,12,0,0/800x600?access_token=mock')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                }}>
                   {/* Fallback pattern if image fails */}
                   <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                </div>

                {/* Geo-fence Zone: Processing Zone */}
                <div className="absolute top-1/3 left-1/3 w-40 h-40 border-2 border-green-500 bg-green-500/10 rounded-full flex items-center justify-center">
                   <span className="text-green-700 font-bold text-xs bg-white/80 px-2 py-1 rounded">落地加工区 (合规)</span>
                </div>

                {/* Geo-fence Zone: Restricted Zone */}
                <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-red-500 bg-red-500/10 rounded-full flex items-center justify-center">
                   <span className="text-red-700 font-bold text-xs bg-white/80 px-2 py-1 rounded">非监管区 (违规)</span>
                </div>

                {/* Truck Marker */}
                <div className="absolute top-[40%] left-[45%] flex flex-col items-center animate-pulse">
                   <div className="p-2 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white">
                      <Truck size={20} />
                   </div>
                   <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg mt-2 border border-gray-200 flex flex-col items-center">
                      <span className="font-bold text-xs text-gray-800">{record.truckPlate}</span>
                      <span className="text-[10px] text-green-600">行驶正常 45km/h</span>
                   </div>
                </div>

                {/* Route Line Mockup */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <path d="M 100 500 Q 200 400 350 250 T 450 220" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 4" />
                </svg>

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                   <button className="bg-white p-2 rounded shadow text-gray-600 hover:text-blue-600"><RefreshCw size={18}/></button>
                   <button className="bg-white p-2 rounded shadow text-gray-600 hover:text-blue-600"><AlertOctagon size={18}/></button>
                </div>
             </div>
           )}

        </div>

        {/* Right: Timeline & Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">监管时间轴</h3>
             <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <Shield size={10} />
                H2018 联网监管
             </div>
          </div>
          <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
            {record.steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className={`absolute -left-[23px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white transition-colors ${
                  step.status === 'completed' ? 'border-green-500 text-green-500' :
                  step.status === 'current' ? 'border-blue-500 text-blue-500' :
                  'border-gray-300 text-gray-300'
                }`}>
                  {step.status === 'completed' && <CheckCircle2 size={12} />}
                  {step.status === 'current' && <Circle size={10} fill="currentColor" />}
                </div>

                {/* Content */}
                <div className={`${step.status === 'pending' ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${step.status === 'current' ? 'text-blue-600' : 'text-gray-800'}`}>
                      {step.title}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono">{step.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">电子围栏规则</h4>
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                   <span>允许进入：落地加工产业园A区</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                   <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                   <span>严禁驶入：高速公路入口 (防倒卖)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
