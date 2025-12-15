import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGetUsers, adminToggleUser, adminVerifyInstructor } from '../services/api';
import { ShieldCheck, User, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminGetUsers,
  });

  const toggleUserMutation = useMutation({
    mutationFn: adminToggleUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const verifyInstructorMutation = useMutation({
    mutationFn: adminVerifyInstructor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  if (isLoading) return <div className="p-20 text-center font-black text-slate-400">Loading System Registry...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <header className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl">
              <ShieldCheck size={32} />
          </div>
          <div className="flex flex-col">
              <h1 className="text-4xl font-black tracking-tighter">System <span className="text-sky-500">Regulation</span></h1>
              <p className="text-slate-500 font-medium">Global authority dashboard for user and asset management.</p>
          </div>
      </header>

      <section className="flex flex-col gap-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
              <User size={18} /> User Registry
          </h2>
          <div className="glass-card overflow-hidden border-none shadow-xl">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {users?.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-8 py-6">
                                  <div className="flex flex-col">
                                      <span className="font-bold text-slate-900">{u.name}</span>
                                      <span className="text-xs text-slate-400 font-medium">{u.email}</span>
                                  </div>
                              </td>
                              <td className="px-8 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : u.role === 'instructor' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
                                      {u.role}
                                  </span>
                              </td>
                              <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                      {u.is_verified ? (
                                          <span className="text-emerald-500 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><CheckCircle size={14} /> Verified</span>
                                      ) : (
                                          <span className="text-amber-500 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><AlertTriangle size={14} /> Pending</span>
                                      )}
                                      {u.is_disabled ? (
                                          <span className="text-red-500 text-xs font-black uppercase tracking-widest">Disabled</span>
                                      ) : (
                                          <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Active</span>
                                      )}
                                  </div>
                              </td>
                              <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                      {u.role === 'instructor' && !u.is_verified && (
                                          <button 
                                            onClick={() => verifyInstructorMutation.mutate(u.id)}
                                            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase hover:bg-emerald-400 transition-all"
                                          >
                                              Authorize
                                          </button>
                                      )}
                                      <button 
                                        onClick={() => toggleUserMutation.mutate(u.id)}
                                        className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${u.is_disabled ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                      >
                                          {u.is_disabled ? 'Enable' : 'Disable'}
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </section>
    </div>
  );
}
