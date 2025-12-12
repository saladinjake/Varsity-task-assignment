import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, LogOut, Menu, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 shadow-lg shadow-sky-500/20">
            <BookOpen size={24} />
          </div>
          <span className="text-2xl font-outfit font-black tracking-tighter text-slate-900 group-hover:text-sky-600 transition-colors">VARSITY</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for courses, skills, or authors..." 
            className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Catalog</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm hover:bg-sky-50 hover:text-sky-600 transition-all">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-transparent">
                  <User size={20} className="text-slate-500" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-bold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all">Login</Link>
              <Link to="/register" className="btn-premium !px-6 !py-2.5 !text-sm">Sign Up</Link>
            </div>
          )}

          <button className="md:hidden text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
