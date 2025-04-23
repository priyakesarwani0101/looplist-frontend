import { User, Loop, LoopCheck, Reaction } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Generate a date string for a given number of days from now
const getDateString = (days: number): string => {
  const date = days >= 0 ? addDays(new Date(), days) : subDays(new Date(), Math.abs(days));
  return format(date, 'yyyy-MM-dd');
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'user2',
    name: 'Taylor Swift',
    email: 'taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'user3',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

// Current user for demo purposes
export const currentUser: User = mockUsers[0];

// Mock Loops
export const mockLoops: Loop[] = [
  {
    id: 'loop1',
    title: 'Read 10 pages',
    frequency: 'daily',
    startDate: getDateString(-30),
    privacy: 'public',
    emoji: '📚',
    userId: 'user1',
    createdAt: getDateString(-30)
  },
  {
    id: 'loop2',
    title: 'Meditate for 5 minutes',
    frequency: 'daily',
    startDate: getDateString(-60),
    privacy: 'public',
    emoji: '🧘',
    userId: 'user1',
    createdAt: getDateString(-60)
  },
  {
    id: 'loop3',
    title: 'No sugar after 7pm',
    frequency: 'daily',
    startDate: getDateString(-14),
    privacy: 'private',
    emoji: '🍬',
    userId: 'user1',
    createdAt: getDateString(-14)
  },
  {
    id: 'loop4',
    title: 'Take vitamins',
    frequency: 'daily',
    startDate: getDateString(-45),
    privacy: 'public',
    emoji: '💊',
    userId: 'user2',
    createdAt: getDateString(-45)
  },
  {
    id: 'loop5',
    title: 'Practice Spanish',
    frequency: '3x-week',
    startDate: getDateString(-20),
    privacy: 'public',
    emoji: '🇪🇸',
    userId: 'user2',
    createdAt: getDateString(-20)
  },
  {
    id: 'loop6',
    title: 'Morning stretching',
    frequency: 'weekdays',
    startDate: getDateString(-25),
    privacy: 'public',
    emoji: '🤸',
    userId: 'user3',
    createdAt: getDateString(-25)
  },
  {
    id: 'loop7',
    title: 'Drink 8 glasses of water',
    frequency: 'daily',
    startDate: getDateString(-30),
    privacy: 'public',
    emoji: '💧',
    userId: 'user3',
    createdAt: getDateString(-30)
  }
];

// Helper function to generate checks with some randomness for realistic data
const generateChecks = (loopId: string, startDateStr: string, completionRate = 0.8): LoopCheck[] => {
  const checks: LoopCheck[] = [];
  const startDate = new Date(startDateStr);
  const today = new Date();
  
  // For each day from start date to today
  for (let d = startDate; d <= today; d = addDays(d, 1)) {
    // Randomly determine if this day was completed based on completion rate
    const completed = Math.random() < completionRate;
    
    checks.push({
      id: `check-${loopId}-${format(d, 'yyyy-MM-dd')}`,
      loopId,
      date: format(d, 'yyyy-MM-dd'),
      completed
    });
  }
  
  return checks;
};

// Generate mock checks for each loop
export const mockChecks: LoopCheck[] = mockLoops.flatMap(loop => 
  generateChecks(loop.id, loop.startDate, Math.random() * 0.3 + 0.6) // Random completion rate between 60-90%
);

// Mock Reactions
export const mockReactions: Reaction[] = [
  {
    id: 'reaction1',
    loopId: 'loop1',
    userId: 'user2',
    emoji: '👏',
    createdAt: getDateString(-5)
  },
  {
    id: 'reaction2',
    loopId: 'loop1',
    userId: 'user3',
    emoji: '🔥',
    createdAt: getDateString(-3)
  },
  {
    id: 'reaction3',
    loopId: 'loop2',
    userId: 'user3',
    emoji: '💯',
    createdAt: getDateString(-7)
  },
  {
    id: 'reaction4',
    loopId: 'loop4',
    userId: 'user1',
    emoji: '👍',
    createdAt: getDateString(-10)
  },
  {
    id: 'reaction5',
    loopId: 'loop6',
    userId: 'user1',
    emoji: '🙌',
    createdAt: getDateString(-2)
  }
];

// Mock data access functions
export const getUserLoops = (userId: string): Loop[] => {
  return mockLoops.filter(loop => loop.userId === userId);
};

export const getPublicLoops = (): Loop[] => {
  return mockLoops.filter(loop => loop.privacy === 'public');
};

export const getLoopById = (loopId: string): Loop | undefined => {
  return mockLoops.find(loop => loop.id === loopId);
};

export const getLoopChecks = (loopId: string): LoopCheck[] => {
  return mockChecks.filter(check => check.loopId === loopId);
};

export const getLoopReactions = (loopId: string): Reaction[] => {
  return mockReactions.filter(reaction => reaction.loopId === loopId);
};

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};