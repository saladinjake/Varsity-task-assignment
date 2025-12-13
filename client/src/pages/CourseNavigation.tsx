import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug, getProgress, updateProgress } from '../services/api';
import { Play, ChevronLeft, Lock, FileText, CheckCircle, Clock, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseNavigation() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course-nav', slug],
    queryFn: () => getCourseBySlug(slug!),
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', course?.id],
    queryFn: () => getProgress(course.id),
    enabled: !!course?.id,
  });

  const progressMutation = useMutation({
    mutationFn: updateProgress,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['progress', course?.id] });
    }
  });

  useEffect(() => {
    if (course && progress && !activeLesson) {
        // Find last started or first uncompleted lesson
        const uncompletedLesson = course.modules?.flatMap((m: any) => m.lessons)
            .find((l: any) => !progress.find((p: any) => p.lesson_id === l.id && p.status === 'completed'));
        
        if (uncompletedLesson) setActiveLesson(uncompletedLesson);
    }
  }, [course, progress]);

  const handleLessonSelect = (lesson: any) => {
    setActiveLesson(lesson);
    // Mark as started if not tracked
    progressMutation.mutate({ 
        courseId: course.id, 
        lessonId: lesson.id, 
        status: 'started' 
    });
  };

  const handleComplete = () => {
    if (!activeLesson) return;
    progressMutation.mutate({ 
        courseId: course.id, 
        lessonId: activeLesson.id, 
        status: 'completed' 
    });
  };

  if (isLoading) return <div className="p-20 text-center font-black text-slate-400">Loading Dashboard Assets...</div>;
  if (!course) return <div className="p-20 text-center font-black text-slate-400">Asset not found.</div>;

  const currentLesson = activeLesson || (course.modules?.[0]?.lessons?.[0]);
  const isLessonCompleted = (id: number) => progress?.some((p: any) => p.lesson_id === id && p.status === 'completed');

  const allLessons = course.modules?.flatMap((m: any) => m.lessons.map((l: any) => ({ ...l, moduleUnlocked: m.is_unlocked }))) || [];
  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === currentLesson?.id);

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
        const next = allLessons[currentLessonIndex + 1];
        if (next.moduleUnlocked) handleLessonSelect(next);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
        handleLessonSelect(allLessons[currentLessonIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden text-slate-600">
        {/* Header */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white z-20 shrink-0 shadow-sm">
            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-900 border border-slate-100">
                    <ChevronLeft size={20} />
                </Link>
                <div className="flex flex-col overflow-hidden">
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest truncate max-w-[200px] md:max-w-md">{course.title}</h1>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[3px]">Academic Dashboard / Professional Edition</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Status</span>
                    <span className="text-xs font-bold text-slate-900 uppercase">Authenticated_User</span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                    Go Back
                </button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-96 border-r border-slate-100 flex-col bg-slate-50/50 overflow-y-auto">
                <nav className="flex flex-col divide-y divide-slate-100">
                    {course.modules?.map((mod: any, mIdx: number) => (
                        <div key={mod.id} className="flex flex-col">
                            <div className="p-6 bg-white/80 border-b border-slate-100/50">
                                <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-[4px] mb-1">MODULE 0{mIdx + 1}</h3>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{mod.title}</p>
                            </div>
                            <div className="flex flex-col">
                                {mod.lessons?.map((lesson: any) => (
                                    <button 
                                        key={lesson.id}
                                        disabled={!mod.is_unlocked}
                                        onClick={() => handleLessonSelect(lesson)}
                                        className={`p-6 flex items-center justify-between transition-all ${currentLesson?.id === lesson.id ? 'bg-sky-50 border-l-4 border-sky-500' : 'hover:bg-slate-100/50 border-l-4 border-transparent'} ${!mod.is_unlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentLesson?.id === lesson.id ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                <Play size={16} fill={currentLesson?.id === lesson.id ? 'currentColor' : 'none'} />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className={`text-sm font-bold ${currentLesson?.id === lesson.id ? 'text-slate-900' : 'text-slate-600'}`}>{lesson.title}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lesson.duration}m • Lab Session</span>
                                            </div>
                                        </div>
                                        {isLessonCompleted(lesson.id) && <CheckCircle size={14} className="text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Player Area */}
            <main className="flex-1 flex flex-col h-full bg-white overflow-y-auto relative">
                {currentLesson ? (
                    <div className="flex flex-col gap-10 p-10 max-w-5xl mx-auto w-full mb-20">
                        <section className="aspect-video bg-slate-100 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden group border border-slate-200">
                            {currentLesson.video_url ? (
                                 <iframe 
                                   className="w-full h-full"
                                   src={currentLesson.video_url}
                                   title={currentLesson.title}
                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                   allowFullScreen
                                 ></iframe>
                            ) : (
                                <div className="flex flex-col items-center gap-6 text-slate-400">
                                    <Lock size={60} />
                                    <span className="font-black text-xs uppercase tracking-[4px]">Resource Encrypted</span>
                                    <p className="text-sm font-medium">Please enroll to unlock full technical documentation and assets.</p>
                                </div>
                            )}
                        </section>

                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{currentLesson.title}</h2>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> Duration: {currentLesson.duration}m</span>
                                        <span className="flex items-center gap-1.5"><FileText size={14} /> Documentation: Included</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        disabled={currentLessonIndex === 0}
                                        onClick={handlePrev}
                                        className="p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100 transition-all disabled:opacity-30 flex items-center gap-2 font-bold text-sm"
                                    >
                                        <ChevronLeft size={16} /> Prev
                                    </button>
                                    <button 
                                        disabled={currentLessonIndex === allLessons.length - 1}
                                        onClick={handleNext}
                                        className="p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100 transition-all disabled:opacity-30 flex items-center gap-2 font-bold text-sm"
                                    >
                                        Next <ChevronLeft size={16} className="rotate-180" />
                                    </button>
                                    <button 
                                        onClick={handleComplete}
                                        disabled={progressMutation.isPending || isLessonCompleted(currentLesson.id)}
                                        className={`px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${isLessonCompleted(currentLesson.id) ? 'bg-emerald-500 text-white cursor-default' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
                                    >
                                        {isLessonCompleted(currentLesson.id) ? "Session Completed" : (progressMutation.isPending ? "Syncing..." : "Mark as Completed")}
                                    </button>
                                </div>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-loose">
                               {currentLesson.content || "Technical documentation session active. Please review the attached media stream and follow along with the curriculum architecture provided in the sidebar."}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-slate-400">
                        <Activity size={48} className="animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-[4px]">Synchronizing Dashboard...</span>
                    </div>
                )}
            </main>
        </div>

        {/* Footer */}
        <footer className="h-12 border-t border-slate-100 bg-white flex items-center justify-between px-8 z-20 shrink-0">
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 VARSITY ACADEMIC</span>
                <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>
                <div className="hidden sm:flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Secure</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">System Latency: Nominal</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Integrity Confirmed</span>
            </div>
        </footer>
    </div>
  );
}
