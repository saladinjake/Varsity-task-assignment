import { Award, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Certification() {
  const { user } = useStore();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 pt-10 px-8">
        <header className="flex flex-col gap-4">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                Academic <span className="text-sky-500">Credentials</span>
            </h1>
            <p className="text-slate-500 font-medium">Monitoring professional certification status for <span className="text-slate-900 font-bold">{user?.name}</span>.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card p-10 flex flex-col gap-8 shadow-premium border-none">
                <div className="w-16 h-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <Award size={32} />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Certification Progress</h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">Enroll in professional-grade curricula and complete all lab sessions to unlock industry-recognized technical engineering credentials.</p>
                </div>
                <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                     <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Standing</span>
                         <span className="text-xs font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase">Professional Level 2</span>
                     </div>
                     <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                         <div className="bg-sky-500 h-full transition-all duration-1000 w-[65%]"></div>
                     </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Dashboard History</h3>
                 {[1, 2].map((i) => (
                     <div key={i} className="glass-card p-6 flex items-center justify-between border-none shadow-sm group hover:shadow-xl transition-all">
                         <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                 <Clock size={20} />
                             </div>
                             <div className="flex flex-col">
                                 <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest leading-none mb-1">Session Asset_{i}952</span>
                                 <span className="font-black text-slate-900 uppercase tracking-tight">Protocol Verification Pending</span>
                             </div>
                         </div>
                         <div className="px-4 py-2 rounded-xl bg-slate-50 flex items-center gap-2 border border-slate-100">
                             <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Awaiting Review</span>
                         </div>
                     </div>
                 ))}
            </div>
        </section>

        <footer className="glass-card p-10 bg-slate-900 border-none shadow-2xl flex items-center justify-between overflow-hidden relative">
            <div className="flex flex-col gap-2 z-10">
                <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none">Initialize Certification Protocol</h3>
                <p className="text-slate-400 text-sm font-medium">Verify your skills via the industrial assessment dashboard to gain verified status.</p>
            </div>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all z-10 shadow-xl">
                Start Exam Process
            </button>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl"></div>
        </footer>
    </div>
  );
}
