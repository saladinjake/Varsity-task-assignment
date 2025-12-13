import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseCarousel({ courses }: { courses: any[] }) {
  const [index, setIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, courses.length - itemsPerPage);

  const next = () => setIndex(i => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setIndex(i => (i === 0 ? maxIndex : i - 1));

  useEffect(() => {
    if (courses.length === 0) return;
    const timer = setInterval(() => {
      next();
    }, 4500);
    return () => clearInterval(timer);
  }, [maxIndex, itemsPerPage, courses.length]);

  return (
    <section className="bg-white py-24 px-6 overflow-hidden rounded-[1rem] mx-6 ">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <h2 className="text-5xl font-outfit font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
              Hand-picked <span className="text-sky-500">Exclusives</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">Specially selected courses for high-impact results.</p>
          </div>
          <div className="flex gap-4 justify-center md:justify-end">
            <button
              onClick={prev}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-50 hover:border-sky-500/20 transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white hover:bg-sky-400 hover:scale-105 transition-all shadow-lg shadow-sky-200"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div
            animate={{ x: `-${(index * 100) / itemsPerPage}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="flex gap-8"
          >
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 group"
                style={{ width: `calc(${100 / itemsPerPage}% - ${((itemsPerPage - 1) * 32) / itemsPerPage}px)` }}
              >
                <Link to={`/course/${course.slug}`} className="block h-full bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-sky-500/30">
                  <div className="relative h-56 mb-8 rounded-2xl overflow-hidden grayscale-0">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'}
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-900">4.9</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sky-600 text-[10px] font-black tracking-widest uppercase mb-1">
                      Featured Course
                    </div>
                    <h3 className="text-xl font-outfit font-black text-slate-900 uppercase tracking-tight line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between pt-6 border-t border-slate-200 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                      Expert Led
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 shadow-inner group-hover:bg-sky-500 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

