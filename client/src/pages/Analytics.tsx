import { Activity, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Analytics() {
  const { user } = useStore();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 pt-10 px-8">
        <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl">
                    <Activity size={20} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                    Session <span className="text-indigo-600">Telemetry</span>
                </h1>
            </div>
            <p className="text-slate-500 font-medium">Monitoring professional performance metrics for <span className="text-slate-900 font-bold">{user?.name}</span>.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatSmall label="Avg session Time" value="48.2m" delta="+4.2%" trend={true} />
            <StatSmall label="Knowledge Retention" value="89.4%" delta="+1.8%" trend={true} />
            <StatSmall label="Curriculum Velocity" value="2.4x" delta="-0.2%" trend={false} />
            <StatSmall label="Active Sessions" value="12" delta="+2" trend={true} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 glass-card p-10 flex flex-col gap-8 shadow-premium border-none">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Activity Protocol Intensity</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Sessions</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Baseline</span>
                    </div>
                </div>
                <div className="h-64 flex items-end gap-3 pt-4">
                    {[45, 60, 40, 80, 55, 90, 75, 65, 85, 50, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-2 items-center group">
                            <div className="w-full bg-indigo-100 rounded-t-lg transition-all group-hover:bg-indigo-500 duration-500 hover:shadow-2xl shadow-indigo-500/20 cursor-pointer" style={{ height: `${h}%` }}></div>
                             <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">S_0{i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card p-10 flex flex-col gap-10 shadow-premium border-none">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Skill Distribution Protocol</h3>
                 <div className="flex flex-col gap-8">
                     <SkillMetric label="Engineering Architecture" value="92%" />
                     <SkillMetric label="System Implementation" value="78%" />
                     <SkillMetric label="Optimization" value="65%" />
                     <SkillMetric label="Security Protocol" value="84%" />
                 </div>
                 <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                          <Zap size={14} /> Optimization Advice
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                          The system suggests allocating more session time to 'Optimization' protocols to maintain technical parity across all lab sessions.
                      </p>
                 </div>
            </div>
        </div>
    </div>
  );
}

function StatSmall({ label, value, delta, trend }: { label: string, value: string, delta: string, trend: boolean }) {
    return (
        <div className="glass-card p-6 flex flex-col gap-4 border-none shadow-sm group hover:shadow-xl transition-all">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-900 leading-none">{value}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${trend ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{delta}</span>
            </div>
        </div>
    );
}

function SkillMetric({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{value}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: value }}></div>
            </div>
        </div>
    );
}
