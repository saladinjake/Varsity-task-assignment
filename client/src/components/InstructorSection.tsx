import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Globe, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: "Shape the Future of <span class='text-sky-500'>Learning</span>.",
    subtitle: "Share your knowledge and inspire the next generation of industry leaders.",
    icon: <Globe className="text-sky-500" />,
    badge: "Join 450+ Instructors"
  },
  {
    title: "Reach a <span class='text-sky-500'>Global</span> Audience.",
    subtitle: "Your courses can impact thousands of students across 150+ countries.",
    icon: <Star className="text-amber-500" />,
    badge: "15k+ Global Enrollments"
  },
  {
    title: "Earn More <span class='text-sky-500'>Working</span> Better.",
    subtitle: "Turn your expertise into a sustainable income stream with our flexible platform.",
    icon: <GraduationCap className="text-purple-500" />,
    badge: "Industry Standard Pay"
  }
];

export default function InstructorSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[1rem] group border border-slate-100 shadow-2xl bg-white">
      <div className="p-20 flex flex-col justify-center gap-12 border-b lg:border-b-0 lg:border-r border-slate-100 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                {slides[index].icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {slides[index].badge}
              </span>
            </div>
            <h2
              className="text-6xl font-outfit font-black tracking-tighter text-slate-900 leading-[0.9] uppercase"
              dangerouslySetInnerHTML={{ __html: slides[index].title }}
            />
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
              {slides[index].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link to="/register" className="btn-premium">
            Get Started Now <ArrowRight size={20} />
          </Link>
          <div className="flex gap-2">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
          className="absolute w-full h-full object-cover transition-transform duration-[20s] ease-linear repeat-infinite scale-110 hover:scale-100"
          alt="Instructor background"
        />
        <div className="absolute inset-0 bg-gray-600 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 p-20 flex flex-col justify-end gap-6 text-white p-20">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-white/60">Success Story</span>
            <p className="text-3xl font-outfit font-black italic tracking-tighter leading-tight">"Teaching on Varsity changed my career. I've reached students I never thought possible."</p>
            <span className="text-sm font-bold uppercase tracking-widest mt-4 flex items-center gap-3">
              <span className="w-12 h-[2px] bg-sky-500"></span> Dr. Sarah Jensen
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
