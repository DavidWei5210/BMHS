
import React, { useState } from 'react';
import { FileText, Package, Truck, Search, RefreshCw } from 'lucide-react';
import { MOCK_LOGISTICS } from '../constants';

export const CustomsServiceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('import-declare');

  const menuItems = [
    { id: 'import-declare', label: '进口申报单申报', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'goods-info', label: '商品信息查询-边民', icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'vehicle-query', label: '运输工具物流查询', icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">通关服务 (Customs Services)</h2>
        <p className="text-gray-500 text-sm mt-1">海关H2018系统对接与物流监管</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              activeTab === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white bg-white hover:border-blue-100'
            }`}
          >
            <div className={`p-4 rounded-full ${item.bg} ${item.color} mb-3`}>
              <item.icon size={28} />
            </div>
            <span className="font-bold text-gray-800">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-6">
         {activeTab === 'import-declare' && (
            <div className="text-center py-10">
               <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-700">暂无待申报单据</h3>
                  <p className="text-sm text-gray-500 mt-2">请前往“订单中心”确认分单后，此处将自动生成申报草稿。</p>
               </div>
            </div>
         )}

         {activeTab === 'goods-info' && (
            <div className="space-y-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="输入商品名称或HS编码..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
               </div>
               <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3">HS编码</th><th className="p-3">商品名称</th><th className="p-3">原产地</th><th className="p-3">完税价格</th></tr></thead>
                     <tbody className="divide-y divide-gray-100">
                        <tr><td className="p-3 font-mono">08013200</td><td className="p-3">鲜或干的去壳腰果</td><td className="p-3">越南</td><td className="p-3">¥42.5/kg</td></tr>
                        <tr><td className="p-3 font-mono">03038990</td><td className="p-3">冻巴沙鱼片</td><td className="p-3">越南</td><td className="p-3">¥12.0/kg</td></tr>
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeTab === 'vehicle-query' && (
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                     <Truck size={24} className="text-blue-600" />
                     <div>
                        <h4 className="font-bold text-gray-800">{MOCK_LOGISTICS.truckPlate}</h4>
                        <p className="text-xs text-gray-500">当前任务: {MOCK_LOGISTICS.orderId}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-200">
                        {MOCK_LOGISTICS.currentLocation}
                     </span>
                  </div>
               </div>
               
               <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
                  {MOCK_LOGISTICS.steps.map((step, idx) => (
                     <div key={idx} className="relative">
                        <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white ${
                           step.status === 'completed' ? 'bg-green-500' : step.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <h4 className="font-bold text-gray-800 text-sm">{step.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">{step.time}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
