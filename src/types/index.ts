export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export type PrivacyType = 'public' | 'private';

export interface Loop {
  id: string;
  title: string;
  emoji: string;
  frequency: string;
  startDate: string;
  description?: string;
  visibility: 'public' | 'private';
  userId: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  reactions?: Reaction[];
  cloneCount?: number;
}

export type LoopCheck = {
  id: string;
  loopId: string;
  date: string;
  completed: boolean;
};

export interface LoopStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCheckIns: number;
  totalSkipped: number;
  status: 'active' | 'broken' | 'completed';
}

export interface Reaction {
  id: string;
  loopId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};