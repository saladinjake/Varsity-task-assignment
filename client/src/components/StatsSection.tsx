import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(spring, (current) => Math.floor(current).toLocaleString() + suffix);
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
}

export default function StatsSection() {
  const stats = [
    { label: "Active Students", value: 12500, suffix: "+" },
    { label: "Expert Mentors", value: 480, suffix: "+" },
    { label: "Global Courses", value: 1200, suffix: "+" },
    { label: "Success Stories", value: 99, suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 hover:border-sky-500/20 transition-all group"
        >
          <div className="text-4xl font-black text-slate-900 font-outfit group-hover:text-sky-600 transition-colors">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
