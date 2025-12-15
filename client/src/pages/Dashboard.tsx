import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ChevronRight, Play, Settings, PlusCircle, ShieldCheck, Layout, Trophy, Activity } from 'lucide-react';
import { getMyCourses } from '../services/api';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
    enabled: isAuthenticated && user?.role === 'student',
  });

  if (!isAuthenticated) {
     setTimeout(() => navigate('/login'), 0);
     return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h1 className="text-5xl font-outfit font-black tracking-tighter text-slate-900">
               Your <span className="text-sky-500">Dashboard</span>
            </h1>
            <div className="flex items-center gap-3">
                {user?.role === 'admin' && (
                    <Link to="/admin" className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-slate-800 transition-all">
                        <ShieldCheck size={18} /> Admin Control
                    </Link>
                )}
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                    <Link to="/instructor/new-course" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-indigo-500 transition-all">
                        <PlusCircle size={18} /> New Course
                    </Link>
                )}
            </div>
        </div>
        <p className="text-slate-500 font-medium text-lg">Monitoring professional growth for <span className="text-slate-900 font-bold">{user?.name}</span>.</p>
      </header>

      {user?.role === 'student' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="flex flex-col gap-2">
                <SidebarItem icon={<Layout size={20} />} label="Overview" to="/dashboard" active={location.pathname === '/dashboard'} />
                <SidebarItem icon={<BookOpen size={20} />} label="My Assets" to="/dashboard/assets" active={location.pathname === '/dashboard/assets'} />
                <SidebarItem icon={<Trophy size={20} />} label="Certification" to="/dashboard/certification" active={location.pathname === '/dashboard/certification'} />
                <SidebarItem icon={<Activity size={20} />} label="Analytics" to="/dashboard/analytics" active={location.pathname === '/dashboard/analytics'} />
                <div className="h-px bg-slate-100 my-4"></div>
                <SidebarItem icon={<Settings size={20} />} label="Settings" to="/dashboard/settings" active={location.pathname === '/dashboard/settings'} />
            </aside>

            <main className="md:col-span-3 flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard label="Time Invested" value="24.5h" delta="+12%" />
                    <StatCard label="Skill Index" value="84%" delta="+2%" />
                    <StatCard label="Course Assets" value={enrolledCourses?.length || 0} delta="New" />
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tighter">Active <span className="text-sky-500">Curriculum</span></h2>
                        <Link to="/" className="text-sm font-bold text-sky-600 hover:text-sky-700">Explore Catalog</Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2].map(i => <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse"></div>)}
                        </div>
                    ) : enrolledCourses?.length === 0 ? (
                        <div className="glass-card p-16 text-center flex flex-col items-center gap-6 border-dashed">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                <BookOpen size={30} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold">No Active Enrollments</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Initialize your learning path by selecting a course from our industrial-grade catalog.</p>
                            </div>
                            <Link to="/" className="btn-premium">Browse Catalog</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {enrolledCourses?.map((course: any) => (
                                <Link key={course.id} to={`/course/${course.slug}/nav`} className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400'} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-xl transition-transform group-hover:scale-110">
                                                <Play size={20} fill="currentColor" className="translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-sky-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                                            <span className="text-xs font-bold text-slate-400">Lead Instructor: {course.instructor_name}</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${course.progress}%` }}
                                                    className="bg-sky-500 h-full"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <span>Completion {course.progress}%</span>
                                                <span className="text-sky-600 flex items-center gap-1">Resume <ChevronRight size={10} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
      ) : (
          <div className="glass-card p-20 text-center flex flex-col items-center gap-8 bg-slate-50 border-none shadow-none">
              <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-sky-500 shadow-xl">
                  <Settings size={44} className="animate-spin-slow" />
              </div>
              <div className="flex flex-col gap-4 max-w-md">
                  <h2 className="text-4xl font-black tracking-tight">Management Mode</h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">
                      Your focal point for system-wide adjustments and resource allocation as <span className="text-slate-900 font-bold uppercase">{user?.role}</span>.
                  </p>
              </div>
              <div className="flex gap-4">
                  {user?.role === 'admin' && (
                      <Link to="/admin" className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-xl">
                          Administrative Panel
                      </Link>
                  )}
                  {user?.role === 'instructor' && (
                      <Link to="/instructor" className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-xl">
                          Course Creation Lab
                      </Link>
                  )}
              </div>
          </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, to = "#", active = false }: { icon: any, label: string, to?: string, active?: boolean }) {
    return (
        <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${active ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            {icon || <Layout size={20} />}
            <span className="uppercase tracking-widest text-[11px] font-black">{label}</span>
        </Link>
    );
}

function StatCard({ label, value, delta }: { label: string, value: string | number, delta: string }) {
    return (
        <div className="glass-card p-8 flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">{label}</span>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black font-outfit text-slate-900">{value}</span>
                <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded-lg">{delta}</span>
            </div>
        </div>
    );
}
