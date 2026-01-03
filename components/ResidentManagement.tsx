
import React, { useState, useEffect } from 'react';
import { MOCK_RESIDENTS, MOCK_GROUPS, API_BASE_URL } from '../constants';
import { ResidentGroup, ResidentProfile } from '../types';
import { Search, Filter, ShieldCheck, UserCheck, Medal, MoreHorizontal, UserPlus, Building, Mail, Users, X, MessageSquare, Smartphone, MessageCircle, Send, Check, Plus, Edit, Trash2, MapPin, Target, FileText, Calendar, TrendingUp, CreditCard, ChevronRight, Activity, RefreshCw } from 'lucide-react';

export const ResidentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'residents' | 'groups'>('residents');
  const [residents, setResidents] = useState<ResidentProfile[]>(MOCK_RESIDENTS);
  const [groups, setGroups] = useState<ResidentGroup[]>(MOCK_GROUPS);
  const [loading, setLoading] = useState(false);

  // Detail & Modals
  const [viewResident, setViewResident] = useState<ResidentProfile | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resR = await fetch(`${API_BASE_URL}/residents`);
        const resultR = await resR.json();
        if (resultR.success) setResidents(resultR.data);

        const resG = await fetch(`${API_BASE_URL}/groups`);
        const resultG = await resG.json();
        if (resultG.success) setGroups(resultG.data);
      } catch (err) {
        console.warn('正在使用本地回退数据');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">边民生态管理</h2>
          <p className="text-slate-500 text-sm mt-1">管理、赋能与发展边民，推进数字化资质转化</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white border rounded-lg text-gray-400 hover:text-blue-600" onClick={() => window.location.reload()}>
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm">
             <UserPlus size={18} /> 新增边民
           </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('residents')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'residents' ? 'border-blue-500 text-blue-600' : 'text-gray-500'}`}>
            <Users size={18} /> 边民名录 ({residents.length})
          </button>
          <button onClick={() => setActiveTab('groups')} className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'groups' ? 'border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>
            <Building size={18} /> 互助组管理 ({groups.length})
          </button>
        </nav>
      </div>

      {activeTab === 'residents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {residents.map((resident) => (
            <div key={resident.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="p-5 flex gap-4">
                 <img src={resident.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${resident.name}`} className="w-16 h-16 rounded-full" />
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{resident.name}</h3>
                    <p className="text-xs text-slate-400">{resident.idCard}</p>
                    <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 w-fit">{resident.level}</div>
                 </div>
              </div>
              <div className="p-4 border-t flex gap-2">
                 <button onClick={() => setViewResident(resident)} className="flex-1 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-600">查看详情</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
           {groups.map(group => (
              <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-center shadow-sm">
                 <div>
                    <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">组长: {group.leader} | 成员: {group.membersCount}人</p>
                 </div>
                 <span className="text-indigo-600 font-bold font-mono">¥{parseFloat(group.availableQuota as any).toLocaleString()}</span>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};
