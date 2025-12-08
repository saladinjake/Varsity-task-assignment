import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { login } from '../services/api';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      setUser(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="glass-card p-10 w-full max-w-md flex flex-col gap-8 shadow-2xl">
        <div className="text-center flex flex-col gap-2">
            <h1 className="text-4xl font-black font-outfit tracking-tighter">Welcome Back.</h1>
            <p className="text-slate-500 font-medium text-sm">Access your high-performance learning dashboard.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
            </div>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="password" 
                    placeholder="Dashboard Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-premium !justify-center py-4 mt-2"
            >
                {loading ? "Authenticating..." : "Sign In"}
                <ArrowRight size={20} />
            </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500">
            Don't have an account? <Link to="/register" className="text-sky-600 font-bold hover:underline">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
