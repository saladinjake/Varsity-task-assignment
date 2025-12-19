import { User, Shield, Eye, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 pt-10 px-8">
        <header className="flex flex-col gap-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                System <span className="text-slate-400">Settings</span>
            </h1>
            <p className="text-slate-500 font-medium">Configuring technical protocols for <span className="text-slate-900 font-bold">{user?.name}</span>.</p>
        </header>

        <section className="flex flex-col gap-8">
            <SettingGroup label="Authentication Registry" icon={<User size={18} />}>
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Registered Email</span>
                        <span className="font-bold text-slate-900">{user?.email}</span>
                    </div>
                </div>
            </SettingGroup>

            <SettingGroup label="Security Protocols" icon={<Shield size={18} />}>
                <div className="flex flex-col divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100/50 overflow-hidden">
                    <ToggleOption label="Encryption Mode" description="Enable end-to-end data session encryption" active={true} />
                    <ToggleOption label="Two-Factor Authentication" description="Require a second verification protocol" active={false} />
                    <ToggleOption label="Activity Monitoring" description="Permit system to track session time metrics" active={true} />
                </div>
            </SettingGroup>

            <SettingGroup label="Visual Interface" icon={<Eye size={18} />}>
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Dashboard Theme</span>
                        <span className="font-bold text-slate-900">Academic Light High-Contrast</span>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Toggle Protocol</button>
                </div>
            </SettingGroup>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none underline decoration-slate-200 decoration-2 underline-offset-4 cursor-pointer">Export Account Data</span>
                <button 
                  onClick={handleLogout}
                  className="px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </section>
    </div>
  );
}

function SettingGroup({ label, icon, children }: { label: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 shadow-text">
                {icon} {label}
            </h3>
            {children}
        </div>
    );
}

function ToggleOption({ label, description, active }: { label: string, description: string, active: boolean }) {
    return (
        <div className="flex items-center justify-between p-6 group hover:bg-slate-100 transition-colors">
            <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-900 text-sm">{label}</span>
                <span className="text-[11px] text-slate-400 font-medium">{description}</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${active ? 'bg-sky-500' : 'bg-slate-200'} cursor-pointer`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );
}
