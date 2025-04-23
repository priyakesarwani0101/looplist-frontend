export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type FrequencyType = 'daily' | 'weekdays' | 'custom' | '3x-week';

export type PrivacyType = 'private' | 'public' | 'friends';

export type Loop = {
  id: string;
  title: string;
  frequency: FrequencyType;
  startDate: string;
  privacy: PrivacyType;
  emoji?: string;
  coverImage?: string;
  userId: string;
  createdAt: string;
};

export type LoopCheck = {
  id: string;
  loopId: string;
  date: string;
  completed: boolean;
};

export type LoopStreak = {
  loopId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  checks: LoopCheck[];
};

export type Reaction = {
  id: string;
  loopId: string;
  userId: string;
  emoji: string;
  createdAt: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};