import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Search, Filter } from 'lucide-react';
import { getMyCourses } from '../services/api';
import { useStore } from '../store/useStore';

export default function MyAssets() {
  const { user, isAuthenticated } = useStore();

  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
    enabled: isAuthenticated && user?.role === 'student',
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 pt-10 px-8 pb-20">
        <header className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                        Active <span className="text-sky-500">Curricula</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm uppercase tracking-widest leading-none">Registered Academic Assets Dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                        <Search size={18} />
                    </div>
                     <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                        <Filter size={18} />
                    </div>
                </div>
            </div>
        </header>

        <section className="flex flex-col gap-8">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse"></div>)}
                </div>
            ) : enrolledCourses?.length === 0 ? (
                <div className="glass-card p-16 text-center flex flex-col items-center gap-6 border-dashed border-2">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <BookOpen size={30} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">No Active Assets</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">Select a course from our professional engineering catalog to initialize your learning session.</p>
                    </div>
                    <Link to="/courses" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Explore Catalog</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses?.map((course: any) => (
                        <Link key={course.id} to={`/course/${course.slug}/nav`} className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all border-none">
                            <div className="relative h-44 overflow-hidden">
                                <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400'} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-xl">
                                        <Play size={18} fill="currentColor" className="translate-x-0.5" />
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                     <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/50">Engineering_Protocol</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-sky-600 transition-colors uppercase tracking-tight line-clamp-2">{course.title}</h3>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                     <div className="flex flex-col">
                                         <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Session Progress</span>
                                         <span className="text-xs font-black text-slate-900">{Math.round(course.progress || 0)}% Completed</span>
                                     </div>
                                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                         <Play size={14} />
                                     </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    </div>
  );
}
