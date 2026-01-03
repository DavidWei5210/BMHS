
import React, { useState } from 'react';
import { Building2, CheckSquare, Receipt, FileText, Truck, BarChart3, Users, Package, Settings, ClipboardList, Wallet, ShoppingCart } from 'lucide-react';
import { MOCK_DEMANDS, MOCK_INVOICES } from '../constants';

export const SecondaryMarketView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('enterprise-orders');

  const menuItems = [
    { id: 'enterprise-orders', label: '收购企业发布订单', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'accept-order', label: '接单', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'invoice-apply', label: '开票申请', icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'invoice-query', label: '开票数据查询', icon: FileText, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'delivery', label: '商品交货', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'stats', label: '个体户交易统计', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'account', label: '边民账户设置', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { id: 'goods-mgmt', label: '商品管理', icon: Package, color: 'text-teal-600', bg: 'bg-teal-100' },
    { id: 'coop-mgmt', label: '合作社批量管理', icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'settle-set', label: '结算设置', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'purchase-need', label: '收购需求管理', icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'fee-set', label: '费用设置', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">二级市场/落地加工 (Secondary Market)</h2>
        <p className="text-gray-500 text-sm mt-1">连接互市一级市场与落地加工企业，完成货权转移与增值税发票开具</p>
      </div>

      {/* Grid Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              activeTab === item.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-white bg-white hover:border-blue-100'
            }`}
          >
            <div className={`p-3 rounded-full ${item.bg} ${item.color} mb-2`}>
              <item.icon size={22} />
            </div>
            <span className="font-medium text-gray-700 text-xs text-center">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] p-6">
         {activeTab === 'enterprise-orders' && (
            <div className="space-y-4">
               <h3 className="font-bold text-lg text-gray-800">企业采购需求池</h3>
               <div className="divide-y divide-gray-100">
                  {MOCK_DEMANDS.map((demand) => (
                     <div key={demand.id} className="py-4 flex justify-between items-center">
                        <div>
                           <h4 className="font-bold text-gray-800">{demand.productName}</h4>
                           <p className="text-sm text-gray-500">{demand.enterpriseName} • {demand.quantity}吨</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-blue-600">¥{demand.targetPrice}</p>
                           <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded mt-1 hover:bg-blue-700">接单</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === 'invoice-apply' && (
            <div className="space-y-4">
               <h3 className="font-bold text-lg text-gray-800">待开票列表</h3>
               <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
                  注意：开票前请确认“资金流、物流、合同流”三流合一，否则税务系统将驳回申请。
               </div>
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50"><tr><th className="p-3">购货方</th><th className="p-3">日期</th><th className="p-3 text-right">金额</th><th className="p-3 text-center">状态</th></tr></thead>
                  <tbody>
                     {MOCK_INVOICES.map(inv => (
                        <tr key={inv.id}>
                           <td className="p-3">鑫源坚果加工厂</td>
                           <td className="p-3 text-gray-500">{inv.date}</td>
                           <td className="p-3 text-right font-bold">¥{inv.amount}</td>
                           <td className="p-3 text-center"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">可开票</span></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {(activeTab !== 'enterprise-orders' && activeTab !== 'invoice-apply') && (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
               <Building2 size={48} className="opacity-20 mb-4" />
               <p>该板块功能正在完善中...</p>
            </div>
         )}
      </div>
    </div>
  );
};
