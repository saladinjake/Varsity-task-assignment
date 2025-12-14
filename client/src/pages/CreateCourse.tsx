import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { instructorCreateCourse } from '../services/api';
import { ArrowLeft, Rocket, Layers, DollarSign, FileText } from 'lucide-react';

export default function CreateCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ 
    title: '', 
    subtitle: '', 
    description: '', 
    price: 0, 
    categoryId: 1, 
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' 
  });

  const createMutation = useMutation({
    mutationFn: instructorCreateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      navigate('/instructor');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">
        <header className="flex flex-col gap-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex flex-col gap-4">
               <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                  Course <span className="text-sky-500">Architecture</span>
               </h1>
               <p className="text-slate-500 text-lg font-medium">Protocol for initializing industrial-grade learning assets.</p>
            </div>
        </header>

        <form onSubmit={handleSubmit} className="glass-card p-12 flex flex-col gap-10 shadow-2xl border-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2 flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Layers size={14} /> Course Designation (Title)
                    </label>
                    <input 
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-slate-900 transition-all"
                        placeholder="e.g. Masterclass in Scalable Architecture"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <FileText size={14} /> Executive Summary (Subtitle)
                    </label>
                    <input 
                        required
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-slate-900 transition-all"
                        placeholder="Brief pitch for the asset"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <DollarSign size={14} /> Base Valuation (USD)
                    </label>
                    <input 
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-slate-900 transition-all"
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Specifications (Description)</label>
                    <textarea 
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-slate-900 transition-all resize-none"
                        placeholder="Deep dive into technical requirements and outcomes..."
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Draft will be initialized in 'Awaiting Review' status</span>
                <button type="submit" disabled={createMutation.isPending} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50">
                    <Rocket size={18} /> {createMutation.isPending ? 'Deploying...' : 'Deploy Curriculum'}
                </button>
            </div>
        </form>
    </div>
  );
}
