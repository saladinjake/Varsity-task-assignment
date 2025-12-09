import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { ArrowRight, Mail, Lock, User, Briefcase } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Account created. Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="glass-card p-10 w-full max-w-lg flex flex-col gap-8 shadow-2xl">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-black font-outfit tracking-tighter">Initialize Account.</h1>
          <p className="text-slate-500 font-medium text-sm">Select your professional track to get started.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
        {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Business Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Dashboard Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <RoleOption
              active={formData.role === 'student'}
              onClick={() => setFormData({ ...formData, role: 'student' })}
              icon={<User size={18} />}
              label="Student"
            />
            <RoleOption
              active={formData.role === 'instructor'}
              onClick={() => setFormData({ ...formData, role: 'instructor' })}
              icon={<Briefcase size={18} />}
              label="Instructor"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-premium !justify-center py-4 mt-2"
          >
            {loading ? "  Loading..." : "Complete Registration"}
            <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
          Already have a dashboard key? <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function RoleOption({ active, onClick, icon, label }: { active: boolean, onClick: any, icon: any, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-3 p-4 rounded-xl font-bold transition-all border-2 ${active ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}
    >
      {icon} {label}
    </button>
  );
}

// function ArrowRight({ className, size }: { className?: string, size?: number }) {
//   return (
//     <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="5" y1="12" x2="19" y2="12"></line>
//       <polyline points="12 5 19 12 12 19"></polyline>
//     </svg>
//   );
// }
