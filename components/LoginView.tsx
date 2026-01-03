
import React, { useState } from 'react';
import { UserCircle, ShieldCheck, Building2, PackageOpen, X, Lock, UserPlus, ArrowLeft, Loader2, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';
import { API_BASE_URL } from '../constants';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onClose?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onClose }) => {
  const [mode, setMode] = useState<'select' | 'login' | 'register'>('select');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [realName, setRealName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setRealName('');
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !realName) {
      alert('请填写完整注册信息');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          realName,
          role: selectedRole
        })
      });
      
      const result = await res.json();
      if (result.success) {
        alert('注册成功，请登录！');
        setMode('login');
      } else {
        alert(result.message || '注册失败');
      }
    } catch (err) {
      alert('连接服务器失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await res.json();
      if (result.success) {
        onLogin(result.data.role);
      } else {
        alert(result.message || '登录失败');
      }
    } catch (err) {
      alert('连接服务器失败');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleCard = (role: UserRole, title: string, desc: string, Icon: any, color: string) => (
    <div 
      onClick={() => { setSelectedRole(role); setMode('login'); }}
      className="group bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-blue-500 rounded-2xl p-8 cursor-pointer transition-all hover:-translate-y-1"
    >
       <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
          <Icon className="text-white" size={32} />
       </div>
       <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">{title}</h3>
       <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      {onClose && (
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
          <X size={32} />
        </button>
      )}

      <div className="max-w-4xl w-full z-10 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
             <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50">
               <PackageOpen className="text-white" size={32} />
             </div>
             <h1 className="text-4xl font-bold text-white tracking-tight">云智边贸</h1>
          </div>
          <p className="text-slate-400 text-lg">
            {mode === 'select' ? '请选择角色' : mode === 'login' ? `用户登录 - ${selectedRole}` : `新账号注册 - ${selectedRole}`}
          </p>
        </div>

        {mode === 'select' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
            {renderRoleCard('resident', '我是边民', '查看额度、参与申报。', UserCircle, 'from-green-400 to-emerald-600')}
            {renderRoleCard('agent', '合作社', '管理后台，监控全局。', ShieldCheck, 'from-purple-400 to-pink-600')}
            {renderRoleCard('enterprise', '企业', '发布需求，管理订单。', Building2, 'from-blue-400 to-indigo-600')}
          </div>
        ) : (
          <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => { setMode('select'); resetForm(); }}
              className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-sm"
            >
              <ArrowLeft size={16} /> 返回
            </button>

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="mt-8 space-y-5">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">真实姓名</label>
                  <input 
                    type="text" 
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">用户名 / 手机号</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">密码</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? '立即登录' : '确认注册'}
              </button>

              <div className="flex justify-between items-center text-xs text-slate-400 mt-4">
                 {mode === 'login' ? (
                   <>
                    <span className="hover:text-white cursor-pointer">忘记密码?</span>
                    <span onClick={() => { setMode('register'); resetForm(); }} className="text-blue-400 hover:text-blue-300 cursor-pointer font-bold">注册新账号</span>
                   </>
                 ) : (
                    <span onClick={() => { setMode('login'); resetForm(); }} className="text-blue-400 hover:text-blue-300 cursor-pointer font-bold w-full text-center">已有账号？返回登录</span>
                 )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
