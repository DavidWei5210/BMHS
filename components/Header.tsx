
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, RefreshCw, Link2, CheckCircle2, LogIn, MapPin, ChevronDown, Settings, Shield, Lock, LogOut, X, ScanFace, Fingerprint, Smartphone, Server } from 'lucide-react';
import { UserRole } from '../types';
import { API_BASE_URL } from '../constants';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
  userRole: UserRole;
  onLogout: () => void;
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, userRole, onLogout, onLoginClick }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Security Settings State
  const [biometricEnabled, setBiometricEnabled] = useState(() => localStorage.getItem('biometricEnabled') === 'true');
  const [changePassForm, setChangePassForm] = useState({ old: '', new: '', confirm: '' });

  // 检测后端健康度
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/stats`);
        if (res.ok) setApiStatus('connected');
        else setApiStatus('error');
      } catch {
        setApiStatus('error');
      }
    };
    checkApi();
    const timer = setInterval(checkApi, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleBiometric = () => {
    const newState = !biometricEnabled;
    setBiometricEnabled(newState);
    localStorage.setItem('biometricEnabled', String(newState));
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePassForm.old || !changePassForm.new || !changePassForm.confirm) {
      alert('请填写完整信息');
      return;
    }
    if (changePassForm.new !== changePassForm.confirm) {
      alert('两次新密码输入不一致');
      return;
    }
    alert('密码修改成功！请重新登录。');
    setShowSecurityModal(false);
    onLogout();
  };

  return (
    <>
      {/* Fix: Bypassed className type issues using spread any */}
      <header {...({ className: "bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-10 lg:left-64 transition-all duration-300" } as any)}>
        <div {...({ className: "flex items-center gap-4" } as any)}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            {...({ className: "lg:hidden p-2 hover:bg-gray-100 rounded-md text-gray-600" } as any)}
          >
            <Menu size={20} />
          </button>
          <div {...({ className: "relative hidden md:block" } as any)}>
            <Search {...({ className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" } as any)} size={18} />
            <input 
              type="text" 
              placeholder="搜索..." 
              {...({ className: "pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 lg:w-96 transition-all" } as any)}
            />
          </div>
        </div>
        
        <div {...({ className: "flex items-center gap-4" } as any)}>
          {/* API Health Indicator */}
          <div {...({ className: `hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            apiStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
            apiStatus === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-200'
          }` } as any)}>
             <Server size={12} {...({ className: apiStatus === 'checking' ? 'animate-spin' : '' } as any)} />
             <span>{apiStatus === 'connected' ? '阿里云 ECS: 已连接' : apiStatus === 'error' ? '后端异常' : '正在检测后端...'}</span>
          </div>

          <div {...({ className: "hidden xl:flex items-center gap-2 mr-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-300 transition-colors cursor-default group" } as any)}>
             <MapPin size={16} {...({ className: "text-blue-600 group-hover:animate-bounce" } as any)} />
             <div {...({ className: "flex flex-col leading-none" } as any)}>
                <span {...({ className: "text-[10px] text-gray-400" } as any)}>当前所属口岸</span>
                <span {...({ className: "text-sm font-bold text-slate-700" } as any)}>靖西龙邦口岸</span>
             </div>
             <span {...({ className: "ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200" } as any)}>运营中</span>
          </div>

          {userRole && (
            <button {...({ className: "relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" } as any)}>
              <Bell size={20} />
              <span {...({ className: "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" } as any)}></span>
            </button>
          )}
          
          {userRole ? (
            <div {...({ className: "relative", ref: dropdownRef } as any)}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                {...({ className: "flex items-center gap-2 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors outline-none" } as any)}
              >
                <div {...({ className: "text-right hidden sm:block" } as any)}>
                  <p {...({ className: "text-sm font-semibold text-gray-800" } as any)}>
                    {userRole === 'agent' ? '龙邦互助社' : userRole === 'enterprise' ? '加工企业' : '边民'}
                  </p>
                  <p {...({ className: "text-xs text-gray-500 flex items-center justify-end gap-1" } as any)}>
                    管理员 <ChevronDown size={10} />
                  </p>
                </div>
                <div {...({ className: `w-9 h-9 rounded-full flex items-center justify-center text-white border border-gray-200 shadow-sm ${
                   userRole === 'agent' ? 'bg-purple-600' : userRole === 'enterprise' ? 'bg-blue-600' : 'bg-green-600'
                }` } as any)}>
                  <User size={18} />
                </div>
              </button>

              {isProfileMenuOpen && (
                <div {...({ className: "absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-scale-in origin-top-right z-50" } as any)}>
                   <div {...({ className: "px-4 py-2 border-b border-gray-100 mb-2" } as any)}>
                      <p {...({ className: "text-sm font-bold text-gray-800" } as any)}>账号设置</p>
                      <p {...({ className: "text-xs text-gray-400 mt-0.5" } as any)}>ID: 882910</p>
                   </div>
                   
                   <button 
                     onClick={() => { setShowSecurityModal(true); setIsProfileMenuOpen(false); }}
                     {...({ className: "w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2" } as any)}
                   >
                      <Shield size={16} {...({ className: "text-blue-500" } as any)} /> 安全中心
                   </button>
                   <button {...({ className: "w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2" } as any)}>
                      <Settings size={16} {...({ className: "text-gray-500" } as any)} /> 系统偏好
                   </button>
                   
                   <div {...({ className: "border-t border-gray-100 mt-2 pt-2" } as any)}>
                      <button 
                        onClick={onLogout}
                        {...({ className: "w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" } as any)}
                      >
                         <LogOut size={16} /> 退出登录
                      </button>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              {...({ className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm" } as any)}
            >
              <LogIn size={16} />
              登录 / 注册
            </button>
          )}
        </div>
      </header>

      {/* Security Center Modal */}
      {showSecurityModal && (
        <div {...({ className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" } as any)}>
           <div {...({ className: "bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in" } as any)}>
              <div {...({ className: "px-6 py-4 border-b border-gray-200 bg-slate-50 flex justify-between items-center" } as any)}>
                 <h3 {...({ className: "font-bold text-lg text-slate-800 flex items-center gap-2" } as any)}>
                    <Shield size={20} {...({ className: "text-blue-600" } as any)} /> 安全中心
                 </h3>
                 <button onClick={() => setShowSecurityModal(false)} {...({ className: "text-gray-400 hover:text-gray-600 bg-white p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors" } as any)}>
                    <X size={18} />
                 </button>
              </div>
              
              <div {...({ className: "p-6 space-y-8" } as any)}>
                 {/* Biometric Toggle */}
                 <div {...({ className: "flex items-center justify-between" } as any)}>
                    <div {...({ className: "flex items-center gap-4" } as any)}>
                       <div {...({ className: `p-3 rounded-full ${biometricEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}` } as any)}>
                          {biometricEnabled ? <ScanFace size={24} /> : <Fingerprint size={24} />}
                       </div>
                       <div {...({ className: "" } as any)}>
                          <p {...({ className: "font-bold text-slate-800" } as any)}>生物识别登录</p>
                          <p {...({ className: "text-xs text-slate-500 mt-0.5" } as any)}>使用 Face ID 或指纹快速验证身份</p>
                       </div>
                    </div>
                    <button 
                       onClick={handleToggleBiometric}
                       {...({ className: `relative w-12 h-6 rounded-full transition-colors duration-300 ${biometricEnabled ? 'bg-green-500' : 'bg-gray-300'}` } as any)}
                    >
                       <div {...({ className: `absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}` } as any)}></div>
                    </button>
                 </div>

                 <hr {...({ className: "border-gray-100" } as any)} />

                 {/* Change Password Form */}
                 <div {...({ className: "" } as any)}>
                    <h4 {...({ className: "font-bold text-slate-800 mb-4 flex items-center gap-2" } as any)}>
                       <Lock size={18} {...({ className: "text-slate-500" } as any)} /> 修改登录密码
                    </h4>
                    {/* Fix: Typed Event as any to bypass target value issue */}
                    <form onSubmit={handleSubmitPassword} {...({ className: "space-y-4" } as any)}>
                       <div {...({ className: "space-y-1" } as any)}>
                          <label {...({ className: "text-xs font-bold text-slate-500" } as any)}>当前密码</label>
                          <input 
                             type="password" 
                             value={changePassForm.old}
                             onChange={(e: any) => setChangePassForm({...changePassForm, old: e.target.value})}
                             {...({ className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm", placeholder: "请输入当前使用的密码" } as any)}
                          />
                       </div>
                       <div {...({ className: "grid grid-cols-2 gap-4" } as any)}>
                          <div {...({ className: "space-y-1" } as any)}>
                             <label {...({ className: "text-xs font-bold text-slate-500" } as any)}>新密码</label>
                             <input 
                                type="password" 
                                value={changePassForm.new}
                                onChange={(e: any) => setChangePassForm({...changePassForm, new: e.target.value})}
                                {...({ className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm", placeholder: "6位以上字符" } as any)}
                             />
                          </div>
                          <div {...({ className: "space-y-1" } as any)}>
                             <label {...({ className: "text-xs font-bold text-slate-500" } as any)}>确认新密码</label>
                             <input 
                                type="password" 
                                value={changePassForm.confirm}
                                onChange={(e: any) => setChangePassForm({...changePassForm, confirm: e.target.value})}
                                {...({ className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm", placeholder: "再次输入" } as any)}
                             />
                          </div>
                       </div>
                       
                       <div {...({ className: "pt-2" } as any)}>
                          <button 
                             type="submit" 
                             {...({ className: "w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 shadow-md transition-colors text-sm" } as any)}
                          >
                             确认修改
                          </button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
