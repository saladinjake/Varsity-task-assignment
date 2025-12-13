import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Play, Star, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { getCourses, getCategories } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoursesExplorer() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'paid'>('all');

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const { data, isLoading } = useQuery({
    queryKey: ['courses-explorer', search, category, sort, page, priceRange],
    queryFn: () => getCourses({ 
        search, 
        category, 
        sort, 
        page, 
        minPrice: priceRange === 'paid' ? 0.01 : undefined,
        maxPrice: priceRange === 'free' ? 0 : undefined
    }),
    placeholderData: (previousData) => previousData,
  });

  const courses = data?.courses || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-outfit font-black tracking-tighter">Course <span className="text-sky-500">Explorer</span></h1>
            <p className="text-slate-500 font-medium text-lg">Deploy into our industrial-grade learning catalog.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text"
                    placeholder="Search by title, technology, or keywords..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                  />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                  <select 
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="flex-1 lg:w-48 bg-white border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-sm"
                  >
                      <option value="">All Categories</option>
                      {catData?.map((cat: any) => (
                          <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                  </select>
                  <select 
                     value={sort}
                     onChange={(e) => setSort(e.target.value)}
                     className="flex-1 lg:w-48 bg-white border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-sm"
                  >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                  </select>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filter By:</span>
              <FilterChip active={priceRange === 'all'} onClick={() => { setPriceRange('all'); setPage(1); }} label="All Assets" />
              <FilterChip active={priceRange === 'free'} onClick={() => { setPriceRange('free'); setPage(1); }} label="Free Access" />
              <FilterChip active={priceRange === 'paid'} onClick={() => { setPriceRange('paid'); setPage(1); }} label="Premium" />
          </div>
      </header>

      <section className="min-h-[400px]">
          {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 rounded-3xl bg-slate-100 animate-pulse"></div>)}
              </div>
          ) : courses.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold">No results found for your query.</h3>
                  <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                  <button onClick={() => { setSearch(''); setCategory(''); setPriceRange('all'); }} className="text-sky-600 font-bold hover:underline mt-2">Clear all filters</button>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  <AnimatePresence mode='popLayout'>
                      {courses.map((course: any) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={course.id}
                          >
                              <Link to={`/course/${course.slug}`} className="glass-card group flex flex-col overflow-hidden h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                  <div className="relative h-48 overflow-hidden">
                                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                      {course.price === 0 && (
                                          <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[2px] rounded-lg shadow-lg">Free</div>
                                      )}
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-xl">
                                              <Play size={18} fill="currentColor" className="translate-x-0.5" />
                                          </div>
                                      </div>
                                  </div>
                                  <div className="p-6 flex flex-col flex-1 gap-4">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-sky-600 uppercase tracking-widest">
                                          <Tag size={12} /> {course.category_name}
                                      </div>
                                      <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tight group-hover:text-sky-600 transition-colors line-clamp-2">{course.title}</h3>
                                      <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-2">{course.subtitle}</p>
                                      
                                      <div className="mt-auto flex flex-col gap-4">
                                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                              <div className="flex items-center gap-1.5">
                                                  <Star size={14} className="text-amber-400 fill-amber-400" />
                                                  <span className="text-sm font-black text-slate-900">4.9</span>
                                                  <span className="text-[10px] font-bold text-slate-400">(2.1k)</span>
                                              </div>
                                              <div className="text-xl font-black text-slate-900">
                                                  {course.price === 0 ? "FREE" : `$${course.price}`}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </Link>
                          </motion.div>
                      ))}
                  </AnimatePresence>
              </div>
          )}
      </section>

      {pagination.totalPages > 1 && (
          <footer className="flex items-center justify-center gap-4 py-8">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  <ArrowLeft size={20} />
              </button>
              <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${page === i + 1 ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white border border-slate-200 text-slate-400 hover:border-sky-500 hover:text-sky-600'}`}
                      >
                          {i + 1}
                      </button>
                  ))}
              </div>
              <button 
                disabled={page === pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  <ArrowRight size={20} />
              </button>
          </footer>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean, onClick: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
            {label}
        </button>
    );
}
