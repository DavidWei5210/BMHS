
import React, { useState } from 'react';
import { Truck, Store, FileSignature, Plus, Search, MapPin, User, CheckCircle2, Clock, AlertCircle, ChevronRight, X } from 'lucide-react';
import { MOCK_VEHICLES, MOCK_SHOP_APPLICATIONS, MOCK_ENTRUSTMENTS } from '../constants';

export const ServiceHall: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'shops' | 'entrustment'>('logistics');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'vehicle' | 'shop' | null>(null);

  // Mock Form State
  const [formData, setFormData] = useState<any>({});

  const handleOpenModal = (type: 'vehicle' | 'shop') => {
    setModalType(type);
    setShowModal(true);
    setFormData({});
  };

  const handleSubmit = () => {
    alert('提交成功！请等待审核。');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">办事大厅 (Service Hall)</h2>
          <p className="text-gray-500 text-sm mt-1">代理商一站式业务办理：运力、场所与合规委托</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setActiveTab('logistics')}
          className={`p-5 rounded-xl border-2 text-left transition-all group flex items-start gap-4 ${
            activeTab === 'logistics' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-white bg-white hover:border-blue-200'
          }`}
        >
           <div className={`p-3 rounded-lg ${activeTab === 'logistics' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <Truck size={24} />
           </div>
           <div>
              <h3 className={`font-bold text-lg ${activeTab === 'logistics' ? 'text-blue-900' : 'text-gray-800'}`}>运力与车辆</h3>
              <p className="text-xs text-gray-500 mt-1">车辆绑定、驾驶员申报</p>
           </div>
        </button>

        <button 
          onClick={() => setActiveTab('shops')}
          className={`p-5 rounded-xl border-2 text-left transition-all group flex items-start gap-4 ${
            activeTab === 'shops' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-white bg-white hover:border-purple-200'
          }`}
        >
           <div className={`p-3 rounded-lg ${activeTab === 'shops' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
              <Store size={24} />
           </div>
           <div>
              <h3 className={`font-bold text-lg ${activeTab === 'shops' ? 'text-purple-900' : 'text-gray-800'}`}>场所与商铺</h3>
              <p className="text-xs text-gray-500 mt-1">商铺申请、加入场所</p>
           </div>
        </button>

        <button 
          onClick={() => setActiveTab('entrustment')}
          className={`p-5 rounded-xl border-2 text-left transition-all group flex items-start gap-4 ${
            activeTab === 'entrustment' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-white bg-white hover:border-emerald-200'
          }`}
        >
           <div className={`p-3 rounded-lg ${activeTab === 'entrustment' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
              <FileSignature size={24} />
           </div>
           <div>
              <h3 className={`font-bold text-lg ${activeTab === 'entrustment' ? 'text-emerald-900' : 'text-gray-800'}`}>业务委托</h3>
              <p className="text-xs text-gray-500 mt-1">落地加工委托协议管理</p>
           </div>
        </button>
      </div>

      {/* --- Tab Content: Logistics --- */}
      {activeTab === 'logistics' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Truck size={20} className="text-blue-600" /> 已备案车辆列表
              </h3>
              <button 
                onClick={() => handleOpenModal('vehicle')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
              >
                 <Plus size={16} /> 新增车辆绑定
              </button>
           </div>
           <div className="divide-y divide-gray-100">
              {MOCK_VEHICLES.map((vehicle) => (
                 <div key={vehicle.id} className="p-5 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                          {vehicle.plate.slice(0, 1)}
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-800 text-lg">{vehicle.plate}</h4>
                          <p className="text-sm text-gray-500">{vehicle.type} | 绑定时间: {vehicle.bindDate}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-1 justify-end">
                             <User size={14} /> {vehicle.driverName}
                          </p>
                          <p className="text-xs text-gray-400">{vehicle.driverPhone}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 
                          vehicle.status === 'busy' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                       }`}>
                          {vehicle.status === 'active' ? '空闲中' : vehicle.status === 'busy' ? '运输中' : '维修中'}
                       </span>
                       <ChevronRight className="text-gray-300" />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- Tab Content: Shops --- */}
      {activeTab === 'shops' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Store size={20} className="text-purple-600" /> 商铺申请记录
              </h3>
              <button 
                onClick={() => handleOpenModal('shop')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 flex items-center gap-2"
              >
                 <Plus size={16} /> 申请新摊位
              </button>
           </div>
           <div className="divide-y divide-gray-100">
              {MOCK_SHOP_APPLICATIONS.map((app) => (
                 <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50">
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-gray-800">{app.shopName}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${
                             app.type === 'physical' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-pink-50 text-pink-700 border-pink-200'
                          }`}>
                             {app.type === 'physical' ? '实体摊位' : '云端店铺'}
                          </span>
                       </div>
                       <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={14} /> {app.location}
                       </p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-xs text-gray-400">申请日期</p>
                          <p className="text-sm font-medium text-gray-700">{app.submitDate}</p>
                       </div>
                       {app.status === 'approved' && (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                             <CheckCircle2 size={16} /> 已通过
                          </span>
                       )}
                       {app.status === 'pending' && (
                          <span className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 px-3 py-1 rounded-full">
                             <Clock size={16} /> 审核中
                          </span>
                       )}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- Tab Content: Entrustment --- */}
      {activeTab === 'entrustment' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
           <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <FileSignature size={20} className="text-emerald-600" /> 落地加工委托协议
              </h3>
              <div className="text-xs text-gray-500 bg-white border px-3 py-1 rounded-full">
                 法律效力：已区块链存证
              </div>
           </div>
           <div className="divide-y divide-gray-100">
              {MOCK_ENTRUSTMENTS.map((ent) => (
                 <div key={ent.id} className="p-6 hover:bg-gray-50 flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{ent.enterpriseName}</h4>
                          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">批次: {ent.batchNo}</span>
                       </div>
                       <p className="text-sm text-gray-600 mb-1">
                          委托方：龙邦镇第一互助组（{ent.residentCount}人）
                       </p>
                       <p className="text-xs text-gray-400">有效期：{ent.validPeriod}</p>
                    </div>
                    <div className="text-right">
                        {ent.status === 'active' ? (
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded text-sm">生效中</span>
                              <button className="text-xs text-blue-600 underline mt-1">查看电子合同</button>
                           </div>
                        ) : (
                           <span className="text-gray-400 font-bold bg-gray-100 px-3 py-1 rounded text-sm">已过期</span>
                        )}
                    </div>
                 </div>
              ))}
           </div>
           <div className="p-4 bg-emerald-50 border-t border-emerald-100 text-emerald-800 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>
                 提示：根据《边民互市贸易管理办法》，边民合作社需代表边民与加工企业签署书面委托协议，明确双方权利义务及食品安全责任。
                 协议有效期最长不超过1年。
              </p>
           </div>
        </div>
      )}

      {/* --- Modal Form (Generic) --- */}
      {showModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
               <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 text-lg">
                     {modalType === 'vehicle' ? '新增车辆绑定' : '商铺入驻申请'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
               </div>
               <div className="p-6 space-y-4">
                  {modalType === 'vehicle' ? (
                     <>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">车牌号码</label>
                           <input type="text" placeholder="例如：桂L·88888" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">车辆类型</label>
                           <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white">
                              <option>9.6米高栏</option>
                              <option>冷链厢式货车</option>
                              <option>集装箱拖车</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">驾驶员姓名</label>
                           <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">联系电话</label>
                           <input type="tel" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                     </>
                  ) : (
                     <>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">商铺名称</label>
                           <input type="text" placeholder="例如：xx互助组坚果直销" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">申请位置</label>
                           <input type="text" placeholder="例如：互市贸易区A栋" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">经营类目</label>
                           <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white">
                              <option>坚果/干果</option>
                              <option>冷冻水产</option>
                              <option>粮油副食</option>
                           </select>
                        </div>
                     </>
                  )}
               </div>
               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">取消</button>
                  <button 
                     onClick={handleSubmit} 
                     className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition-colors ${
                        modalType === 'vehicle' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                     }`}
                  >
                     提交申请
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
