
import React, { useState } from 'react';
import { MOCK_DEMANDS } from '../constants';
import { ShoppingCart, Plus, Building2, Users, ArrowRight, ArrowRightLeft, Clock, CheckCircle2 } from 'lucide-react';

export const MutualTradeView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">企互匹配中心 (Enterprise Demand)</h2>
          <p className="text-slate-500 text-sm mt-1">承接落地加工企业采购需求，智能撮合互助组履约</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition-all">
          <Plus size={18} /> 管理企业白名单
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">当前活跃采购需求</h3>
                 <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border">共 {MOCK_DEMANDS.length} 条</span>
              </div>
              <div className="divide-y divide-slate-100">
                 {MOCK_DEMANDS.map((demand) => (
                   <div key={demand.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h4 className="text-lg font-bold text-slate-800">{demand.productName}</h4>
                               <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">企业需求</span>
                            </div>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                               <Building2 size={14} /> {demand.enterpriseName}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">¥{demand.targetPrice}<span className="text-xs font-normal text-slate-400">/{demand.unit}</span></p>
                            <p className="text-xs text-slate-400">截止: {demand.deadline}</p>
                         </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between mb-4">
                         <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1.5">
                               <span className="text-slate-500 font-medium">匹配履约进度</span>
                               <span className="text-blue-600 font-bold">{demand.matchProgress}%</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-1.5 border border-slate-200">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${demand.matchProgress}%` }}></div>
                            </div>
                         </div>
                         <div className="pl-6 flex flex-col items-center">
                            <p className="text-lg font-bold text-slate-700">{demand.residentCount}</p>
                            <p className="text-[10px] text-slate-400 uppercase">已报边民</p>
                         </div>
                      </div>

                      <div className="flex gap-3">
                         <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                            指派互助组 <Users size={16} />
                         </button>
                         <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">
                            查看匹配详情
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-indigo-500" /> 撮合效率分析
              </h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                       <span>平均响应时长</span>
                       <span className="text-slate-800 font-bold">14 分钟</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-2">
                       <span>需求匹配成功率</span>
                       <span className="text-slate-800 font-bold">92%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: '92%' }}></div>
                    </div>
                 </div>
              </div>
              <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <p className="text-xs text-blue-700 leading-relaxed font-medium">
                   💡 系统提示：目前“坚果类”需求旺盛，但弄岛组边民参与度下降，建议通过APP下发积分翻倍通知。
                 </p>
              </div>
           </div>

           <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="font-bold mb-2">数字化撮合引擎已开启</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-4">系统自动根据边民LBS、信用等级、以往品类记录进行需求推送。</p>
                 <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <span>查看运行日志</span> <ArrowRight size={14} />
                 </div>
              </div>
              <CheckCircle2 className="absolute -right-4 -bottom-4 text-white/5" size={120} />
           </div>
        </div>
      </div>
    </div>
  );
};
