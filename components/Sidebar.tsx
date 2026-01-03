
import React from 'react';
import { LayoutDashboard, ShoppingCart, Users, Wallet, ShieldCheck, LogOut, PackageOpen, UserCircle, ScanFace, Store, Truck, Newspaper, Briefcase, ShoppingBag, ListOrdered, Database } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  navItems: { id: string; label: string; icon: string }[];
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, navItems, onLogout }) => {
  const icons: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard size={20} />,
    ShoppingCart: <ShoppingCart size={20} />,
    Users: <Users size={20} />,
    Wallet: <Wallet size={20} />,
    ShieldCheck: <ShieldCheck size={20} />,
    UserCircle: <UserCircle size={20} />,
    ScanFace: <ScanFace size={20} />,
    Store: <Store size={20} />,
    Truck: <Truck size={20} />,
    Newspaper: <Newspaper size={20} />,
    Briefcase: <Briefcase size={20} />,
    ShoppingBag: <ShoppingBag size={20} />,
    ListOrdered: <ListOrdered size={20} />,
    Database: <Database size={20} />,
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <PackageOpen className="text-blue-400 mr-3" size={28} />
          <div>
            <h1 className="font-bold text-lg tracking-tight">边贸通</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">云智边贸</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4 overflow-y-auto max-h-[calc(100vh-140px)] sidebar-scroll">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                {icons[item.icon] || <Store size={20} />} 
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
          >
            <LogOut size={20} />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>
    </>
  );
};
