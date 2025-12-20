import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    text: "The platform's AI-curated curriculum transformed my approach to learning. I gained more in 3 months than I did in 3 years of traditional education.",
    author: "Liam Montgomery",
    title: "Senior Software Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    text: "As an instructor, the varsity-app has allowed me to reach more students than ever before. The interface is stunning and easy to use.",
    author: "Jessica Williams",
    title: "Designer & Artist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    text: "Varsity is the best platform for high-quality education. The handpicked courses are excellent for deep skill progression.",
    author: "David Miller",
    title: "Student at MIT",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    text: "I loved the flexible learning path. The transition from zero to a professional role was incredibly smooth and well-guided.",
    author: "Sarah Chen",
    title: "Junior Data Scientist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5
  }
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto flex flex-col gap-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-center text-center md:text-left gap-8">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black tracking-widest uppercase w-fit mx-auto md:mx-0">
            Student Stories
          </div>
          <h2 className="text-5xl font-outfit font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
            Voices of <span className="text-sky-500">Success</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">Join thousands of students who have changed their lives with Varsity.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={prev}
            className="w-14 h-14 rounded-2xl border border-slate-100 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-all shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative h-[auto] min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="bg-white border border-slate-100 p-10 md:p-20 rounded-[4rem] shadow-premium flex flex-col md:flex-row gap-12 items-center max-w-5xl mx-auto hover:border-sky-500/20 transition-all duration-500 group">
                <div className="relative shrink-0">
                    <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                        <img src={testimonials[index].image} className="w-full h-full object-cover" alt={testimonials[index].author} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white border-4 border-white shadow-xl">
                        <Quote size={20} className="fill-white" />
                    </div>
                </div>
                <div className="flex flex-col gap-8 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1">
                        {[...Array(testimonials[index].rating)].map((_, i) => (
                            <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                    <h3 className="text-2xl md:text-4xl font-outfit font-black text-slate-900 italic leading-snug tracking-tighter uppercase line-clamp-4">
                        "{testimonials[index].text}"
                    </h3>
                    <div className="flex flex-col gap-1 pt-6 border-t border-slate-100 w-fit mx-auto md:mx-0">
                        <span className="text-xl font-black text-slate-900 uppercase tracking-widest">{testimonials[index].author}</span>
                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">{testimonials[index].title}</span>
                    </div>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-8 text-center pt-8">
         <div className="flex -space-x-4">
            {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white bg-sky-500 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-sky-200">
                12k+
            </div>
         </div>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Trusted by global industry professionals worldwide</p>
      </div>
    </section>
  );
}

