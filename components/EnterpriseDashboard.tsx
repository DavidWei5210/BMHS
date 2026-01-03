
import React, { useState } from 'react';
import { MOCK_PROCUREMENT_DEMANDS, MOCK_ORDERS, MOCK_LABOR_DEMANDS, MOCK_RESIDENTS } from '../constants';
import { Plus, ShoppingCart, Building2, Search, Filter, PiggyBank, Coins, TrendingDown, ArrowRight, FileText, Landmark, Calculator, Printer, Receipt, CheckCircle, Percent, Briefcase, Calendar, MapPin, Users, CheckSquare, AlertTriangle, X, Phone, UserCheck, Truck, Package, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Order, LaborDemand } from '../types';

// Mock Data for Finance
const MOCK_FUND_LOGS = [
  { id: 'F-20231025-01', orderId: 'ORD-001', type: '采购支付', amount: 2125000, savings: 485000, date: '2023-10-25', desc: '越南干腰果采购 - 互助资金代付', invoiceStatus: 'pending' },
  { id: 'F-20231022-03', orderId: 'ORD-002', type: '采购支付', amount: 360000, savings: 72000, date: '2023-10-22', desc: '冻巴沙鱼采购 - 互助资金代付', invoiceStatus: 'issued' },
  { id: 'F-20231018-05', orderId: 'ORD-OLD-01', type: '采购支付', amount: 850000, savings: 195000, date: '2023-10-18', desc: '缅甸碎米采购', invoiceStatus: 'issued' },
];

const COST_COMPARISON_DATA = [
  { name: '采购货值', general: 100, mutual: 100 },
  { name: '关税成本', general: 20, mutual: 0 },
  { name: '增值税/票据成本', general: 13, mutual: 3 }, // 模拟一般贸易13% vs 互市3%票据成本
  { name: '资金占用成本', general: 2, mutual: 0.5 },
];

export const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demands' | 'orders' | 'finance' | 'labor'>('demands');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [issuingInvoice, setIssuingInvoice] = useState<string | null>(null);

  // --- New Interaction States ---
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedLabor, setSelectedLabor] = useState<LaborDemand | null>(null);

  // Statistics
  const totalUsedFunds = 3335000;
  const totalSavedFunds = 752000;
  
  // Tax Calculations
  const vatInputDeduction = totalUsedFunds * 0.09; // 9% deduction rule
  const serviceFeeRate = 0.005; // 0.5% platform fee

  // Labor Form State
  const [laborCompliance, setLaborCompliance] = useState(false);

  const handleIssueInvoice = (id: string) => {
    setIssuingInvoice(id);
    setTimeout(() => {
        setIssuingInvoice(null);
        alert("开票申请已提交至税务数字接口！\n\n您将获得：《互市贸易专用发票》\n进项抵扣率：9%");
    }, 1500);
  };

  const handlePublishLabor = () => {
    if (!laborCompliance) {
      alert("请先确认并勾选《劳动法用工合规承诺书》");
      return;
    }
    alert("用工需求已发布！合作社将为您匹配人员。");
    setShowLaborModal(false);
    setLaborCompliance(false);
  };

  const handleConfirmWorker = (workerName: string) => {
    alert(`已确认录用 ${workerName}，系统将自动生成用工协议。`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">企业工作台</h2>
          <p className="text-gray-500 text-sm mt-1">鑫源坚果加工有限公司 | 纳税人识别号: 91451000MA*****</p>
        </div>
        <div>
          {activeTab === 'demands' && (
            <button 
              onClick={() => setShowPublishModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> 发布新需求
            </button>
          )}
          {activeTab === 'labor' && (
            <button 
              onClick={() => setShowLaborModal(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> 发布用工需求
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('demands')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'demands'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            我的采购需求
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            执行订单
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'labor'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Briefcase size={16} />
            劳务用工
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Receipt size={16} />
            税务合规与开票
          </button>
        </nav>
      </div>

      {/* --- Tab 1: Demands --- */}
      {activeTab === 'demands' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-6 divide-y divide-gray-100">
             {MOCK_PROCUREMENT_DEMANDS.map((demand) => (
               <div key={demand.id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2 py-0.5 text-xs font-bold rounded ${demand.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {demand.status === 'active' ? '发布中' : '已完成'}
                           </span>
                           <h4 className="font-bold text-gray-800 text-lg">{demand.productName}</h4>
                           <span className="text-xs text-gray-400">#{demand.id}</span>
                        </div>
                        <div className="flex gap-6 text-sm text-gray-600">
                           <span>需求量: <b>{demand.quantity} {demand.unit}</b></span>
                           <span>目标价: <b>¥{demand.targetPrice}</b></span>
                           <span>截止: {demand.deadline}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">撮合进度</div>
                        <div className="w-32 bg-gray-100 rounded-full h-2 mb-1">
                           <div className="bg-blue-600 h-2 rounded-full" style={{width: `${demand.matchProgress}%`}}></div>
                        </div>
                        <span className="text-blue-600 font-bold text-sm">{demand.matchProgress}%</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* --- Tab 2: Orders --- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-500 font-medium">
               <tr>
                 <th className="px-6 py-3">订单编号/商品</th>
                 <th className="px-6 py-3 text-right">总金额</th>
                 <th className="px-6 py-3">状态</th>
                 <th className="px-6 py-3">日期</th>
                 <th className="px-6 py-3 text-right">操作</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {MOCK_ORDERS.map((order) => (
                 <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors group"
                 >
                   <td className="px-6 py-4">
                     <div className="font-bold text-gray-800 group-hover:text-blue-700">{order.productName}</div>
                     <div className="text-xs text-gray-400">{order.id}</div>
                   </td>
                   <td className="px-6 py-4 text-right font-medium font-mono text-gray-800">¥{order.totalAmount.toLocaleString()}</td>
                   <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs border border-blue-100">{order.status}</span>
                   </td>
                   <td className="px-6 py-4 text-gray-500">{order.date}</td>
                   <td className="px-6 py-4 text-right">
                      <span className="text-blue-600 text-xs font-bold hover:underline">查看详情 &gt;</span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {/* --- Tab 3: Labor Services (NEW) --- */}
      {activeTab === 'labor' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-4 items-start">
              <Briefcase className="text-emerald-600 shrink-0 mt-1" />
              <div>
                 <h4 className="font-bold text-emerald-800">劳务助农增收计划</h4>
                 <p className="text-sm text-emerald-700 mt-1">
                    发布您的装卸、运输、理货等临时用工需求，由合作社统一组织边民承接。增加边民收入，降低企业用工风险。
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_LABOR_DEMANDS.map(item => (
                 <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-5 border-b border-gray-100">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                             item.status === 'hiring' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                             {item.status === 'hiring' ? '招聘中' : '已满员'}
                          </span>
                       </div>
                       <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                          <MapPin size={14} /> {item.location}
                       </p>
                       <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                             {item.wage}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                             需 {item.peopleCount} 人
                          </span>
                       </div>
                    </div>
                    <div className="p-5 bg-gray-50 flex-1">
                       <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                          <Calendar size={14} /> 工作时间: {item.workDate} {item.workTime}
                       </div>
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle size={14} className="text-green-500" /> 劳动法合规校验通过
                       </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
                       <div className="text-xs text-gray-500">
                          已报名: <span className="font-bold text-indigo-600">{item.appliedCount}</span> 人
                       </div>
                       <button 
                         onClick={() => setSelectedLabor(item)}
                         className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                       >
                          管理名单
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- Tab 4: Finance & Tax (Enhanced) --- */}
      {activeTab === 'finance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top KPI Cards with Tax Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                      <Landmark size={16} /> 本月累计采购额
                   </div>
                   <h3 className="text-3xl font-bold text-gray-800">¥{totalUsedFunds.toLocaleString()}</h3>
                   <div className="flex gap-2 mt-2">
                     <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">实付货款</span>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-1">
                      <Percent size={16} /> 预计进项抵扣额 (VAT Input)
                   </div>
                   <h3 className="text-3xl font-bold">¥{vatInputDeduction.toLocaleString()}</h3>
                   <p className="text-xs text-indigo-200 mt-2 opacity-80 flex items-center gap-1">
                     <CheckCircle size={12} /> 依据边民互市落地加工政策 (扣除率9%)
                   </p>
                </div>
                <Calculator className="absolute right-4 bottom-4 text-white opacity-10" size={80} />
             </div>

             <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium mb-1">
                      <TrendingDown size={16} /> 综合税负节约
                   </div>
                   <h3 className="text-3xl font-bold">¥{totalSavedFunds.toLocaleString()}</h3>
                   <p className="text-xs text-emerald-100 mt-2 opacity-80">对比一般贸易进口成本</p>
                </div>
                <PiggyBank className="absolute right-4 bottom-4 text-white opacity-10" size={80} />
             </div>
          </div>

          {/* Transaction History Table with Invoice Action */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">采购支付与开票管理</h3>
                <div className="flex gap-2">
                   <button className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">导出月度报表</button>
                </div>
             </div>
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                   <tr>
                      <th className="px-6 py-3">交易流水/日期</th>
                      <th className="px-6 py-3">关联订单</th>
                      <th className="px-6 py-3 text-right">交易金额 (CNY)</th>
                      <th className="px-6 py-3 text-center">进项税额 (9%)</th>
                      <th className="px-6 py-3 text-center">发票状态</th>
                      <th className="px-6 py-3 text-right">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {MOCK_FUND_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4">
                            <div className="font-mono text-gray-600 font-bold">{log.id}</div>
                            <div className="text-xs text-gray-400">{log.date}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="text-gray-800 font-medium">{log.desc}</div>
                            <div className="text-xs text-blue-500">{log.orderId}</div>
                         </td>
                         <td className="px-6 py-4 text-right font-bold text-gray-800">
                            ¥{log.amount.toLocaleString()}
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                               ¥{(log.amount * 0.09).toLocaleString()}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-center">
                            {log.invoiceStatus === 'issued' ? (
                               <span className="flex items-center justify-center gap-1 text-green-600 text-xs font-bold">
                                  <CheckCircle size={12} /> 已开票
                               </span>
                            ) : (
                               <span className="text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">
                                  待开票
                               </span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            {log.invoiceStatus === 'issued' ? (
                               <button className="text-blue-600 hover:underline text-xs">下载 PDF</button>
                            ) : (
                               <button 
                                 onClick={() => handleIssueInvoice(log.id)}
                                 disabled={issuingInvoice === log.id}
                                 className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1 ml-auto"
                               >
                                  {issuingInvoice === log.id ? '申报中...' : <><Printer size={12} /> 申请开票</>}
                               </button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
             <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                <FileText size={18} />
             </div>
             <div>
                <h4 className="font-bold text-blue-800 text-sm">税务合规提示</h4>
                <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                   根据《边民互市贸易管理办法》及相关税务规定，加工企业向边民合作社采购进口农产品，
                   凭海关签发的进口货物报关单及合作社开具的《互市贸易专用发票》，可按 9% 计算抵扣进项税额。
                   请确保资金流、物流、合同流“三流合一”以满足税务稽查要求。
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Procurement Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <h3 className="font-bold text-lg mb-4">发布新的采购需求</h3>
              <div className="space-y-4">
                 <input type="text" placeholder="商品名称" className="w-full border p-2 rounded" />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="数量" className="w-full border p-2 rounded" />
                    <input type="number" placeholder="单价" className="w-full border p-2 rounded" />
                 </div>
                 <textarea placeholder="备注要求..." className="w-full border p-2 rounded h-24"></textarea>
                 <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 text-gray-600">取消</button>
                    <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded">发布</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Labor Publish Modal (NEW) */}
      {showLaborModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Briefcase size={20} className="text-emerald-600" /> 发布劳务用工需求
                 </h3>
                 <button onClick={() => setShowLaborModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">岗位名称</label>
                    <input type="text" placeholder="例如：装卸搬运工" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">工种类型</label>
                       <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none bg-white">
                          <option>装卸搬运</option>
                          <option>运输配送</option>
                          <option>理货分拣</option>
                          <option>其他</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">需求人数</label>
                       <input type="number" placeholder="0" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">薪资待遇</label>
                       <input type="text" placeholder="例如：200元/天" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">工作日期</label>
                       <input type="date" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">工作地点</label>
                    <input type="text" placeholder="详细地址" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">任职要求</label>
                    <textarea placeholder="例如：年龄要求、身体状况等..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none h-20 resize-none focus:ring-2 focus:ring-emerald-500"></textarea>
                 </div>

                 {/* Compliance Check */}
                 <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-2">
                    <div className="flex gap-3 items-start">
                       <input 
                         type="checkbox" 
                         id="complianceCheck" 
                         checked={laborCompliance} 
                         onChange={(e) => setLaborCompliance(e.target.checked)}
                         className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer" 
                       />
                       <div>
                          <label htmlFor="complianceCheck" className="text-sm font-bold text-amber-800 cursor-pointer select-none">
                             我已阅读并承诺遵守《企业劳动用工合规条款》
                          </label>
                          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                             1. 承诺不安排未成年人及超过法定退休年龄人员从事高危作业。<br/>
                             2. 承诺按时足额支付劳动报酬，不低于当地最低工资标准。<br/>
                             3. 承诺为劳动者提供必要的安全防护用品和劳动保护。
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setShowLaborModal(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    取消
                 </button>
                 <button 
                   onClick={handlePublishLabor} 
                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md transition-colors"
                 >
                    确认发布
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- NEW: Order Detail Modal --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-scale-in backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                       <FileText size={22} className="text-blue-600" /> {selectedOrder.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                       订单编号: <span className="font-mono text-gray-700 font-bold">{selectedOrder.id}</span>
                    </p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-8">
                 {/* Stepper */}
                 <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                       <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle size={16} /></div>
                       <span className="text-xs font-bold text-green-600">已下单</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                       <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"><Coins size={16} /></div>
                       <span className="text-xs font-bold text-blue-600">已支付</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-200"><Truck size={16} /></div>
                       <span className="text-xs font-bold text-blue-600">运输中</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                       <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-2 border-gray-200"><Briefcase size={16} /></div>
                       <span className="text-xs font-bold text-gray-400">待入库</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div>
                       <span className="text-xs text-gray-500 block mb-1">采购数量</span>
                       <span className="text-lg font-bold text-gray-800">{selectedOrder.quantity} 吨</span>
                    </div>
                    <div>
                       <span className="text-xs text-gray-500 block mb-1">订单总金额</span>
                       <span className="text-lg font-bold text-blue-600">¥{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                       <span className="text-xs text-gray-500 block mb-1">物流状态</span>
                       <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                          <Truck size={14} className="text-blue-500"/> 车辆桂L·88291 运输中
                       </span>
                    </div>
                    <div>
                       <span className="text-xs text-gray-500 block mb-1">预计到达</span>
                       <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                          <Clock size={14} className="text-orange-500"/> 2023-10-27 14:00
                       </span>
                    </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                    <button className="text-sm text-blue-600 font-bold hover:underline">查看电子合同 &gt;</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- NEW: Labor Worker List Modal --- */}
      {selectedLabor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-scale-in backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <div>
                    <h3 className="font-bold text-gray-800 text-lg">用工报名名单管理</h3>
                    <p className="text-xs text-gray-500 mt-1">
                       需求: {selectedLabor.title} | 需 {selectedLabor.peopleCount} 人 | 已报 {selectedLabor.appliedCount} 人
                    </p>
                 </div>
                 <button onClick={() => setSelectedLabor(null)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-0">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                       <tr>
                          <th className="px-6 py-3">姓名</th>
                          <th className="px-6 py-3">身份证号 (脱敏)</th>
                          <th className="px-6 py-3">互助组</th>
                          <th className="px-6 py-3 text-center">状态</th>
                          <th className="px-6 py-3 text-right">操作</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {/* Simulate filtering mock residents as applicants */}
                       {MOCK_RESIDENTS.slice(0, selectedLabor.appliedCount).map((worker, idx) => (
                          <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                      {worker.name[0]}
                                   </div>
                                   <span className="font-bold text-gray-700">{worker.name}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 font-mono text-gray-500 text-xs">{worker.idCard}</td>
                             <td className="px-6 py-4 text-gray-600 text-xs">龙邦第一互助组</td>
                             <td className="px-6 py-4 text-center">
                                {idx < 2 ? (
                                   <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                                      <CheckCircle size={10} /> 已录用
                                   </span>
                                ) : (
                                   <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">
                                      待审核
                                   </span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-right">
                                {idx >= 2 && (
                                   <button 
                                     onClick={() => handleConfirmWorker(worker.name)}
                                     className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors shadow-sm"
                                   >
                                      确认录用
                                   </button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {selectedLabor.appliedCount === 0 && (
                    <div className="p-10 text-center text-gray-400">
                       <Users size={40} className="mx-auto mb-2 opacity-30"/>
                       <p>暂无报名人员</p>
                    </div>
                 )}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                 <p className="text-xs text-gray-500">
                    <span className="text-red-500">*</span> 请确认人员已购买意外险
                 </p>
                 <button onClick={() => setSelectedLabor(null)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100">
                    关闭
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
