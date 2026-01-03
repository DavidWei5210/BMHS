import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Activity, Lock, Users, Search } from 'lucide-react';
import { MOCK_RISK_PROJECTS } from '../constants';

export const RiskView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">风控中心 (Risk Control)</h2>
          <p className="text-gray-500 text-sm mt-1">贸易真实性核验与项目合规总览</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
             生成风控报告
           </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-100 text-green-600 rounded-lg">
             <ShieldCheck size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">平台合规指数</p>
             <h3 className="text-2xl font-bold text-gray-800">98.5</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
             <AlertTriangle size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">今日预警</p>
             <h3 className="text-2xl font-bold text-gray-800">3 <span className="text-sm font-normal text-gray-400">起</span></h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
             <Lock size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">资金闭环率</p>
             <h3 className="text-2xl font-bold text-gray-800">100%</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
             <Activity size={24} />
           </div>
           <div>
             <p className="text-sm text-gray-500">LBS在界率</p>
             <h3 className="text-2xl font-bold text-gray-800">99.2%</h3>
           </div>
        </div>
      </div>

      {/* Project Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> 风控中心项目总明细
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索项目或企业..." 
                className="pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
               <tr>
                 <th className="px-6 py-3">项目编号/名称</th>
                 <th className="px-6 py-3">关联加工企业</th>
                 <th className="px-6 py-3">交易商品</th>
                 <th className="px-6 py-3 text-right">累计交易额</th>
                 <th className="px-6 py-3 text-center">参与边民</th>
                 <th className="px-6 py-3 text-center">合规评分</th>
                 <th className="px-6 py-3 text-center">风险等级</th>
                 <th className="px-6 py-3 text-center">状态</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {MOCK_RISK_PROJECTS.map((project) => (
                 <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4">
                     <div className="font-bold text-gray-800">{project.projectName}</div>
                     <div className="text-xs text-gray-400">{project.id}</div>
                   </td>
                   <td className="px-6 py-4 text-gray-600">{project.enterprise}</td>
                   <td className="px-6 py-4">
                     <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 text-xs">
                       {project.commodity}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right font-medium text-gray-800">
                     ¥{project.totalTradeAmount.toLocaleString()}
                   </td>
                   <td className="px-6 py-4 text-center text-gray-600">
                     <div className="flex items-center justify-center gap-1">
                       <Users size={14} /> {project.participantCount}
                     </div>
                   </td>
                   <td className="px-6 py-4 text-center">
                     <div className="inline-block w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${project.complianceScore > 90 ? 'bg-green-500' : project.complianceScore > 80 ? 'bg-blue-500' : 'bg-red-500'}`} 
                         style={{width: `${project.complianceScore}%`}}
                       ></div>
                     </div>
                     <div className="text-xs text-gray-500 mt-1">{project.complianceScore}分</div>
                   </td>
                   <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                       project.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                       project.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                       'bg-red-100 text-red-700'
                     }`}>
                       {project.riskLevel === 'low' ? '低风险' : project.riskLevel === 'medium' ? '中风险' : '高风险'}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-center">
                     {project.status === 'active' ? (
                       <span className="flex items-center justify-center gap-1 text-green-600 text-xs font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> 运行中
                       </span>
                     ) : (
                        <span className="flex items-center justify-center gap-1 text-gray-400 text-xs font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 暂停
                       </span>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
            <span>显示 3 条记录，共 3 条</span>
            <div className="space-x-2">
              <span className="cursor-pointer hover:text-blue-600">上一页</span>
              <span className="cursor-pointer hover:text-blue-600">下一页</span>
            </div>
         </div>
      </div>
    </div>
  );
};
