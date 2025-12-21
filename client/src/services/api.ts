import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('varsity_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials: any) => api.post('/auth/login', credentials).then(r => r.data);
export const register = (userData: any) => api.post('/auth/register', userData).then(r => r.data);

export const getCourses = (params?: any) =>
  api.get('/courses', { params }).then(r => r.data);
export const getCategories = () =>
  api.get('/categories').then(r => r.data);
export const getCourseBySlug = (slug: string) =>
  api.get(`/courses/${slug}`).then(r => r.data);
export const getMyCourses = () =>
  api.get('/my-courses').then(r => r.data);
export const getProgress = (courseId: number) =>
  api.get(`/my-progress/${courseId}`).then(r => r.data);
export const updateProgress = (payload: { courseId: number, lessonId: number, status: string, lastPosition?: number }) =>
  api.post('/update-progress', payload).then(r => r.data);
export const enrollInCourse = (payload: any) =>
  api.post('/enroll', payload).then(r => r.data);

export const createPaymentSession = (payload: { courseId: number, paymentMethod: string }) =>
  api.post('/payment/create-session', payload).then(r => r.data);

export const verifyPaystackPayment = (reference: string) =>
  api.post('/payment/verify-paystack', { reference }).then(r => r.data);

export const adminGetUsers = () =>
  api.get('/admin/users').then(r => r.data);
export const adminToggleUser = (id: number) =>
  api.post(`/admin/users/${id}/toggle-disabled`).then(r => r.data);
export const adminVerifyInstructor = (id: number) =>
  api.post(`/admin/instructors/${id}/verify`).then(r => r.data);
export const adminToggleExpire = (id: number) =>
  api.post(`/admin/courses/${id}/toggle-expire`).then(r => r.data);
export const adminPublishCourse = (id: number) =>
  api.post(`/instructor/courses/${id}/publish`).then(r => r.data);

export const instructorGetCourses = () =>
  api.get('/instructor/my-courses').then(r => r.data);
export const instructorCreateCourse = (course: any) =>
  api.post('/instructor/courses', course).then(r => r.data);
export const instructorAddModule = (id: number, mod: any) =>
  api.post(`/instructor/courses/${id}/modules`, mod).then(r => r.data);
export const instructorAddLesson = (modId: number, lesson: any) =>
  api.post(`/instructor/modules/${modId}/lessons`, lesson).then(r => r.data);

export default api;
