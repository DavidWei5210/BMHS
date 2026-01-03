
import React, { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { Wallet, ArrowUpRight, ArrowDownRight, PieChart, Lock, CreditCard, Upload, FileText, CheckCircle2, X, Loader2, ShieldCheck, RefreshCw, AlertCircle, Building, Check } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

export const FinanceView: React.FC = () => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [step, setStep] = useState<'upload' | 'review' | 'processing' | 'success'>('upload');
  const [isUploading, setIsUploading] = useState(false);

  const pieData = [
    { name: '银行本金还款', value: 75, color: '#3b82f6' },
    { name: '边民收益', value: 15, color: '#10b981' },
    { name: '代理服务费', value: 5, color: '#f59e0b' },
    { name: '税费与其他', value: 5, color: '#6366f1' },
  ];

  const mockBatchSummary = {
    fileName: '20231026_弄岛组_分红代付清单.xlsx',
    totalCount: 158,
    totalAmount: 458000.00,
    serviceFee: 229.00,
    account: '6227 **** **** 8888'
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep('review');
    }, 2000);
  };

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const resetModal = () => {
    setShowBankModal(false);
    setTimeout(() => setStep('upload'), 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">资金监管中心</h2>
          <p className="text-gray-500 text-sm mt-1">闭环资金流管理与智能分账系统 (Smart Profit Sharing)</p>
        </div>
        <div>
           <button 
             onClick={() => setShowBankModal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition-all"
           >
             <CreditCard size={18} /> 银企直连 / 批量代付
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Overview & Pie Chart */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-200 text-sm font-medium mb-1">监管账户总余额</p>
              <h3 className="text-3xl font-bold mb-4">¥8,450,000.00</h3>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-blue-200 text-xs">冻结质保金</p>
                  <p className="font-semibold">¥1,200,000</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">待分账资金</p>
                  <p className="font-semibold">¥350,000</p>
                </div>
              </div>
            </div>
            <Lock className="absolute right-4 bottom-4 text-blue-500 opacity-20" size={120} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-gray-500" /> 资金分账模型
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Transaction List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">近期资金流水</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">查看全部</button>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_TRANSACTIONS.map((trx) => (
              <div key={trx.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${trx.type === 'inflow' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trx.type === 'inflow' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{trx.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{trx.timestamp} • {trx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${trx.type === 'inflow' ? 'text-green-600' : 'text-gray-800'}`}>
                    {trx.type === 'inflow' ? '+' : '-'} ¥{trx.amount.toLocaleString()}
                  </p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                    {trx.type === 'inflow' ? '监管入账' : '自动划转'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Bank Integration Modal --- */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       <Building size={20} className="text-indigo-600" /> 银企直连支付网关
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div>
                          BOC 中国银行 API 已连接
                       </span>
                       <span className="text-[10px] text-gray-400">延迟: 45ms</span>
                    </div>
                 </div>
                 <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                   <X size={20} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                 {/* Step 1: Upload */}
                 {step === 'upload' && (
                    <div className="space-y-6 animate-scale-in">
                       <div 
                          onClick={handleFileUpload}
                          className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                             isUploading ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-slate-50'
                          }`}
                       >
                          {isUploading ? (
                             <div className="flex flex-col items-center">
                                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                                <p className="text-indigo-800 font-bold">正在解析加密文件...</p>
                                <p className="text-xs text-indigo-500 mt-1">正在进行格式校验与风控扫描</p>
                             </div>
                          ) : (
                             <div className="flex flex-col items-center">
                                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                   <Upload size={32} />
                                </div>
                                <p className="text-slate-700 font-bold text-lg">点击上传批量代付清单</p>
                                <p className="text-slate-400 text-sm mt-2">支持 Excel (.xlsx) 或 CSV 格式</p>
                                <p className="text-xs text-slate-300 mt-4">单次最大支持 2000 笔交易</p>
                             </div>
                          )}
                       </div>
                       <div className="flex justify-between items-center text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="flex items-center gap-1"><ShieldCheck size={12} /> 传输通道已加密 (TLS 1.3)</span>
                          <span className="underline cursor-pointer hover:text-indigo-600">下载标准模板</span>
                       </div>
                    </div>
                 )}

                 {/* Step 2: Review */}
                 {step === 'review' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-4">
                             <FileText className="text-indigo-600" />
                             <div>
                                <p className="font-bold text-indigo-900 text-sm">{mockBatchSummary.fileName}</p>
                                <p className="text-xs text-indigo-500">解析成功 • {mockBatchSummary.totalCount} 笔交易</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t border-indigo-100 pt-4">
                             <div>
                                <p className="text-xs text-indigo-400 mb-1">付款总金额</p>
                                <p className="text-xl font-bold text-indigo-800">¥{mockBatchSummary.totalAmount.toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-xs text-indigo-400 mb-1">预估手续费</p>
                                <p className="text-lg font-bold text-indigo-800">¥{mockBatchSummary.serviceFee}</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                             <span className="text-sm text-gray-600">付款账户</span>
                             <span className="font-mono font-bold text-gray-800">{mockBatchSummary.account}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                             <span className="text-sm text-gray-600 flex items-center gap-2"><ShieldCheck size={16} className="text-green-500" /> 风控校验</span>
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">全部通过</span>
                          </div>
                       </div>

                       <div className="flex gap-3 pt-2">
                          <button onClick={() => setStep('upload')} className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50">
                             重新上传
                          </button>
                          <button onClick={handlePay} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                             确认并支付
                          </button>
                       </div>
                    </div>
                 )}

                 {/* Step 3: Processing */}
                 {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-fade-in">
                       <div className="relative">
                          <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                          <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
                          <Building className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                       </div>
                       <div className="text-center space-y-2">
                          <h4 className="text-xl font-bold text-gray-800">正在执行批量代付...</h4>
                          <div className="text-sm text-gray-500 flex flex-col gap-1">
                             <span className="animate-pulse">正在连接银行核心系统...</span>
                             <span className="animate-pulse delay-75">校验支付令牌...</span>
                             <span className="animate-pulse delay-150">写入区块链存证...</span>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Step 4: Success */}
                 {step === 'success' && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-scale-in">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-200">
                          <Check size={40} strokeWidth={4} />
                       </div>
                       <div className="text-center">
                          <h4 className="text-2xl font-bold text-gray-800">支付指令已提交</h4>
                          <p className="text-gray-500 mt-2">银行受理成功，预计 2 分钟内到账</p>
                          <div className="mt-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 inline-block">
                             <span className="text-xs text-gray-400 mr-2">交易流水号</span>
                             <span className="font-mono text-sm font-bold text-gray-700">TXN-20231026-88291</span>
                          </div>
                       </div>
                       <button onClick={resetModal} className="px-8 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 mt-2">
                          关闭窗口
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
