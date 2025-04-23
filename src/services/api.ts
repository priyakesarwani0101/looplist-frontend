import axios from 'axios';
import { getPublicLoops } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Loop {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  visibility: 'public' | 'private';
  emoji: string;
  coverImage?: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoopRequest {
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  visibility: 'public' | 'private';
  emoji: string;
}

export interface Reaction {
  id: string;
  loopId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface CloneRequest {
  loopId: string;
}

export interface UpdateLoopRequest {
  title?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  visibility?: 'public' | 'private';
  emoji?: string;
}

export interface LoopStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
  status: 'active' | 'broken' | 'completed';
}

export interface DailyCheckIn {
  id: string;
  loopId: string;
  date: string;
  status: 'completed' | 'skipped';
  notes?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
  status: 'completed' | 'skipped' | 'missed';
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', credentials);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.get<{ message: string }>('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  }
};

export const loopService = {
  createLoop: async (data: CreateLoopRequest): Promise<Loop> => {
    const response = await api.post<Loop>('/loops', data);
    return response.data;
  },

  updateLoop: async (loopId: string, data: UpdateLoopRequest): Promise<Loop> => {
    const response = await api.patch<Loop>(`/loops/${loopId}`, data);
    return response.data;
  },

  getLoops: async (): Promise<Loop[]> => {
    const response = await api.get<Loop[]>('/loops/my');
    return response.data;
  },

  getPublicLoops: async (): Promise<Loop[]> => {
    const response = await api.get<Loop[]>('/loops/public');
    return response.data;
  },

  getLoopById: async (loopId: string): Promise<Loop> => {
    const response = await api.get<Loop>(`/loops/${loopId}`);
    return response.data;
  },

  getLoopReactions: async (loopId: string): Promise<Reaction[]> => {
    const response = await api.get<Reaction[]>(`/reactions/${loopId}`);
    return response.data;
  },

  addReaction: async (loopId: string, emoji: string): Promise<Reaction> => {
    const response = await api.post<Reaction>(`/reactions/${loopId}`, { emoji });
    return response.data;
  },

  cloneLoop: async (loopId: string): Promise<Loop> => {
    const response = await api.post<Loop>(`/loops/${loopId}/clone`);
    return response.data;
  },

  checkIn: async (loopId: string, date: string, status: 'completed' | 'skipped', notes?: string): Promise<DailyCheckIn> => {
    const response = await api.post<DailyCheckIn>(`/loops/${loopId}/streak`, {
      date,
      status,
      notes
    });
    return response.data;
  },

  getLoopStats: async (loopId: string): Promise<LoopStats> => {
    const response = await api.get<LoopStats>(`/loops/${loopId}/stats`);
    return response.data;
  },

  getLoopHeatmap: async (loopId: string): Promise<HeatmapData[]> => {
    const response = await api.get<HeatmapData[]>(`/loops/${loopId}/heatmap`);
    return response.data;
  },

  getLoopCheckIns: async (loopId: string): Promise<DailyCheckIn[]> => {
    const response = await api.get<DailyCheckIn[]>(`/loops/${loopId}/check-ins`);
    return response.data;
  }
};

export default api; 