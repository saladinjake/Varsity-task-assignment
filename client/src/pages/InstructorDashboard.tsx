import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorGetCourses, adminPublishCourse } from '../services/api';
import { PlusCircle, BookOpen, Clock, Play, LayoutDashboard, CheckCircle, Globe, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function InstructorDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useStore();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: instructorGetCourses,
  });

  const publishMutation = useMutation({
    mutationFn: adminPublishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
    },
  });

  if (isLoading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Initialising Laboratory Assets...</div>;

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-12 flex flex-col gap-12">
      <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                  <LayoutDashboard size={32} />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-4xl font-black tracking-tighter">Assets <span className="text-indigo-600">Registry</span></h1>
                  <p className="text-slate-500 font-medium">Monitoring {user?.role === 'admin' ? 'global ecosystem' : 'professional'} curriculum development sessions.</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
               {user?.role === 'admin' && (
                  <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                      <ShieldAlert size={16} className="text-amber-600" />
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Administrative Overide Active</span>
                  </div>
               )}
               <Link 
                to="/instructor/new-course"
                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black flex items-center gap-3 transition-all hover:bg-slate-800 shadow-xl"
               >
                  <PlusCircle size={18} /> Initialize Course
               </Link>
          </div>
      </header>

      <section className="flex flex-col gap-6">
          <div className="glass-card overflow-hidden border-none shadow-premium">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Identification</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Category</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Status</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {courses?.map((c: any) => (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-10 py-8">
                                  <div className="flex items-center gap-6">
                                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-white transition-all shadow-sm">
                                          <BookOpen size={24} />
                                      </div>
                                      <div className="flex flex-col gap-1 min-w-0">
                                          <span className="font-black text-slate-900 uppercase tracking-tight truncate max-w-xs">{c.title}</span>
                                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                              <span className="flex items-center gap-1.5 text-indigo-500"><Clock size={12} /> 12 Sessions Added</span>
                                              {user?.role === 'admin' && <span className="text-slate-300">• Instructor: {c.instructor_name || 'System'}</span>}
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-10 py-8">
                                  <span className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest border border-sky-100/50">
                                      Engineering
                                  </span>
                              </td>
                              <td className="px-10 py-8">
                                  {c.is_published ? (
                                      <div className="flex items-center gap-2 text-emerald-600">
                                          <Globe size={14} />
                                          <span className="text-[10px] font-black uppercase tracking-widest">Global Live</span>
                                      </div>
                                  ) : (
                                      <div className="flex items-center gap-2 text-amber-500">
                                          <Lock size={14} />
                                          <span className="text-[10px] font-black uppercase tracking-widest">Internal Draft</span>
                                      </div>
                                  )}
                              </td>
                              <td className="px-10 py-8 font-black text-slate-900">
                                  ${c.price}
                              </td>
                              <td className="px-10 py-8">
                                  <div className="flex items-center gap-4">
                                      {user?.role === 'admin' && !c.is_published && (
                                          <button 
                                            onClick={() => publishMutation.mutate(c.id)}
                                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                          >
                                              <CheckCircle size={14} /> Publish Asset
                                          </button>
                                      )}
                                      <button 
                                        onClick={() => navigate(`/course/${c.slug}`)}
                                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all flex items-center gap-2"
                                      >
                                          <Play size={14} /> Preview
                                      </button>
                                      <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all">
                                          <ArrowRight size={20} />
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {courses?.length === 0 && (
                          <tr>
                              <td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-[4px]">
                                  No Laboratory Assets Detected
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </section>
    </div>
  );
}
