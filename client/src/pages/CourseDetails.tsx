import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, Globe, Shield, BarChart, ChevronRight, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourseBySlug, enrollInCourse } from '../services/api';
import { useStore } from '../store/useStore';
import PaymentWizard from '../components/PaymentWizard';
import { AnimatePresence } from 'framer-motion';

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourseBySlug(slug!),
    enabled: !!slug,
  });

  const enrollmentMutation = useMutation({
    mutationFn: (payload: any) => enrollInCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', slug] });
      navigate('/dashboard?enrolled=true');
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) return navigate('/login');
    console.log(course.is_enrolled, "<<<")
    if (course.is_enrolled) {
      toast.success("Active session detected! Initializing dashboard...", {
        icon: '',
        style: { borderRadius: '15px', background: '#0f172a', color: '#fff', fontWeight: 'bold' }
      });
      return navigate(`/course/${course.slug}/nav`);
    }

    // ths will for now we can simulate payment flow for paid courses bcus i need to implement stripe k later
    if (course.price > 0) {
      setShowPayment(true);
    } else {
      enrollmentMutation.mutate({ courseId: course.id });
    }
  };

  if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-slate-500 font-bold">Initializing Varsity Dashboard...</div>;
  if (!course) return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-slate-500 font-bold">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-6 max-w-3xl">
        <div className="flex gap-2 items-center text-sm font-black text-sky-600 uppercase tracking-widest">
          <span>Catalog</span> <ChevronRight size={14} /> <span>{course.category_name}</span>
        </div>
        <h1 className="text-6xl font-outfit font-black tracking-tighter leading-[0.95] text-slate-900">
          {course.title}
        </h1>
        <p className="text-2xl text-slate-500 font-medium leading-relaxed">
          {course.subtitle}
        </p>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
              {course.instructor_name[0]}
            </div>
            <span className="text-sm font-bold text-slate-900">Created by <span className="text-sky-600">{course.instructor_name}</span></span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 flex flex-col gap-12">
          <section className="glass-card overflow-hidden bg-black">
            <div className="relative aspect-video">
              {course.modules?.[0]?.lessons?.find((l: any) => l.is_preview)?.video_url ? (
                <iframe
                  className="w-full h-full"
                  src={course.modules[0].lessons.find((l: any) => l.is_preview).video_url}
                  title="Course Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-900 transition-transform group-hover:scale-110 shadow-xl">
                      <Play size={24} fill="currentColor" className="translate-x-1" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-black mb-6 tracking-tight">Executive Summary</h3>
              <p className="text-slate-500 leading-loose">
                {course.description || "Dive deep into modern principles and methodologies. This course is designed to take you from foundational understanding to advanced professional execution."}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-10">
            <h3 className="text-3xl font-black tracking-tighter">Curriculum <span className="text-sky-500">Architecture</span></h3>
            <div className="flex flex-col gap-8">
              {course.modules?.map((mod: any, mIdx: number) => (
                <div key={mod.id} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                      <span className="text-sky-500">0{mIdx + 1}</span> {mod.title}
                    </h4>
                    {!mod.is_unlocked && <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><Lock size={12} /> Locked</span>}
                    {mod.is_unlocked && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><CheckCircle size={12} /> Unlocked</span>}
                  </div>
                  <div className="flex flex-col gap-3">
                    {mod.lessons?.map((lesson: any, lIdx: number) => (
                      <div key={lesson.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${mod.is_unlocked ? 'bg-white border-slate-100 hover:border-sky-500 group cursor-pointer' : 'bg-slate-50 border-transparent opacity-60'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${mod.is_unlocked ? 'bg-sky-50 text-sky-600' : 'bg-slate-200 text-slate-400'}`}>
                            {lIdx + 1}
                          </div>
                          <span className="font-bold text-slate-900">{lesson.title}</span>
                        </div>
                        {mod.is_unlocked ? <Play size={16} className="text-sky-500" /> : <Lock size={16} className="text-slate-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="sticky top-32 flex flex-col gap-8">
          <div className="glass-card p-10 flex flex-col gap-8 bg-slate-900 text-white border-none shadow-2xl">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-outfit tracking-tighter">${course.price}</span>
              <span className="text-slate-400 text-sm line-through font-bold">${(course.price * 1.5).toFixed(2)}</span>
            </div>

            {course.is_enrolled ? (
              <button
                onClick={() => navigate(`/course/${course.slug}/nav`)}
                className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
              >
                Enter Dashboard
                <ArrowRight size={20} />
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleEnroll}
                  disabled={enrollmentMutation.isPending}
                  className="w-full py-5 rounded-2xl bg-sky-500 text-white font-black hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-3"
                >
                  {enrollmentMutation.isPending ? "Transmitting..." : "Enroll"}
                  <ArrowRight size={20} />
                </button>
                <button className="w-full py-5 rounded-2xl border border-white/20 text-white font-black hover:bg-white/10 transition-all">
                  Try Sample Content
                </button>
              </div>
            )}

            <div className="flex flex-col gap-5 pt-8 border-t border-white/10">
              <h5 className="text-[10px] font-black uppercase tracking-[3px] text-sky-400">Includes Assets</h5>
              <div className="flex flex-col gap-3">
                <AssetItem icon={<Clock size={16} />} text="12.5 hours on-demand" />
                <AssetItem icon={<BarChart size={16} />} text="Professional Analytics" />
                <AssetItem icon={<Globe size={16} />} text="Global Access" />
                <AssetItem icon={<Shield size={16} />} text="Certified Assessment" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 bg-sky-50 border-sky-100 flex flex-col gap-4 shadow-none">
            <h4 className="text-sky-900 font-black">Industrial Training</h4>
            <p className="text-sky-800/70 text-sm font-medium">Get your team elite training with enterprise license management.</p>
            <button className="text-sky-600 font-bold text-sm hover:translate-x-1 transition-transform flex items-center gap-1">
              Varsity Business <ChevronRight size={14} />
            </button>
          </div>
        </aside>
      </div>
      <AnimatePresence>
        {showPayment && (
          <PaymentWizard
            course={course}
            onClose={() => setShowPayment(false)}
            onSuccess={() => {
              setShowPayment(false);
              queryClient.invalidateQueries({ queryKey: ['course', slug] });
              navigate('/dashboard?enrolled=true');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AssetItem({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
      <div className="text-sky-400">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
