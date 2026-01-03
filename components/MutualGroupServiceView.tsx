
import React, { useState } from 'react';
import { FileSignature, FileText, Settings, Users, AlertCircle, ChevronRight } from 'lucide-react';
import { MOCK_ENTRUSTMENTS } from '../constants';

export const MutualGroupServiceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('entrust-info');

  const menuItems = [
    { id: 'entrust-info', label: '落地加工委托信息', icon: FileSignature, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'entrust-declare', label: '落地加工委托申报', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'account-settings', label: '一级市场默认账户', icon: Settings, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">互助组服务 (Group Services)</h2>
        <p className="text-gray-500 text-sm mt-1">委托申报与互助组基础设置</p>
      </div>

      {/* Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all hover:shadow-md text-left ${
              activeTab === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white bg-white hover:border-blue-100'
            }`}
          >
            <div className={`p-3 rounded-full ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
               <span className="font-bold text-gray-700 block text-lg">{item.label}</span>
               <span className="text-xs text-gray-400">点击管理</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
         {activeTab.includes('entrust') ? (
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                     <FileSignature size={20} className="text-blue-600" /> 委托协议管理
                  </h3>
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                     <Users size={12} /> 龙邦镇第一互助组
                  </div>
               </div>

               <div className="divide-y divide-gray-100">
                  {MOCK_ENTRUSTMENTS.map((ent) => (
                     <div key={ent.id} className="py-5 flex items-start justify-between group hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors cursor-pointer">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">{ent.enterpriseName}</h4>
                              <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">批次: {ent.batchNo}</span>
                           </div>
                           <p className="text-sm text-gray-600 mb-1">
                              委托人数：{ent.residentCount} 人
                           </p>
                           <p className="text-xs text-gray-400">有效期：{ent.validPeriod}</p>
                        </div>
                        <div className="text-right flex flex-col items-end h-full justify-between">
                            {ent.status === 'active' ? (
                               <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded text-sm mb-2">生效中</span>
                            ) : (
                               <span className="text-gray-400 font-bold bg-gray-100 px-3 py-1 rounded text-sm mb-2">已过期</span>
                            )}
                            <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 p-4 bg-blue-50 border-t border-blue-100 text-blue-800 text-xs flex items-start gap-2 rounded-lg">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>
                     说明：根据《边民互市贸易管理办法》，互助组需代表边民与加工企业签署书面委托协议，并进行线上备案。
                     只有“生效中”的委托关系才可进行每日申报。
                  </p>
               </div>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
               <Settings size={48} className="opacity-20 mb-4" />
               <p>账户设置功能开发中...</p>
            </div>
         )}
      </div>
    </div>
  );
};
