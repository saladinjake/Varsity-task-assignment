import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CoursesExplorer from './pages/CoursesExplorer';
import CourseDetails from './pages/CourseDetails';
import CourseNavigation from './pages/CourseNavigation';
import CreateCourse from './pages/CreateCourse';


import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

import Certification from './pages/Certification';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MyAssets from './pages/MyAssets';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen flex flex-col bg-[#fcfdfe] text-[#0f172a] font-jakarta antialiased">
          <Routes>
            {/* Pages with Navbar */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow pt-24">
                  <Routes>

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<CoursesExplorer />} />
                    <Route path="/course/:slug" element={<CourseDetails />} />
                    <Route path="/instructor/new-course" element={<CreateCourse />} />


                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/instructor" element={<InstructorDashboard />} />

                    <Route path="/dashboard/certification" element={<Certification />} />
                    <Route path="/dashboard/analytics" element={<Analytics />} />
                    <Route path="/dashboard/settings" element={<Settings />} />

                  </Routes>
                </main>
              </>
            } />
            {/* Pages without Navbar (Full Screen Player) */}
            <Route path="/course/:slug/nav" element={<CourseNavigation />} />
          </Routes>

          <footer className="bg-white border-t border-slate-200 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 font-medium">
              <p>&copy; 2026 Varsity EdTech. High-Performance Learning Ecosystem.</p>
            </div>
          </footer>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
