import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://syria-vision-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          Cookies.set('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),

  register: (data: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    full_name?: string;
  }) => api.post('/auth/register/', data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),

  getMe: () => api.get('/auth/me/'),

  getProfile: () => api.get('/auth/profile/'),

  updateProfile: (data: FormData | object) =>
    api.put('/auth/profile/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  changePassword: (old_password: string, new_password: string) =>
    api.put('/auth/profile/password/', { old_password, new_password }),

  // ✅ دالة رفع الصورة - تمت إضافتها داخل الكائن
  uploadAvatar: (formData: FormData) =>
    api.post('/auth/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Forum API
export const forumAPI = {
  getCategories: () => api.get('/forum/categories/'),

  getCategoryPosts: (categoryId: number, page = 1) =>
    api.get(`/forum/categories/${categoryId}/posts/?page=${page}`),

  getPosts: (page = 1) => api.get(`/forum/posts/?page=${page}`),

  getPost: (postId: number) => api.get(`/forum/posts/${postId}/`),

  createPost: (data: { category: number; title: string; content: string }) =>
    api.post('/forum/posts/create/', data),

  updatePost: (postId: number, data: { title: string; content: string }) =>
    api.put(`/forum/posts/${postId}/update/`, data),

  deletePost: (postId: number) => api.delete(`/forum/posts/${postId}/delete/`),

  likePost: (postId: number) => api.post(`/forum/posts/${postId}/like/`),

  createReply: (data: { post: number; content: string; parent?: number }) =>
    api.post('/forum/replies/create/', data),

  likeReply: (replyId: number) => api.post(`/forum/replies/${replyId}/like/`),

  searchPosts: (query: string) => api.get(`/forum/search/?q=${query}`),
};

// Events API
export const eventsAPI = {
  getEvents: (page = 1) => api.get(`/events/?page=${page}`),

  getUpcomingEvents: () => api.get('/events/upcoming/'),

  getPastEvents: () => api.get('/events/past/'),

  getFeaturedEvents: () => api.get('/events/featured/'),

  getEvent: (eventId: number) => api.get(`/events/${eventId}/`),

  getEventResults: (eventId: number) => api.get(`/events/${eventId}/results/`),

  getEventGallery: (eventId: number) => api.get(`/events/${eventId}/gallery/`),

  registerForEvent: (data: {
    event: number;
    team_name: string;
    team_members: string[];
    project_idea?: string;
    field?: string;
  }) => api.post('/events/register/', data),

  getMyRegistrations: () => api.get('/events/my-registrations/'),

  withdrawRegistration: (registrationId: number) =>
    api.post(`/events/registrations/${registrationId}/withdraw/`),
};