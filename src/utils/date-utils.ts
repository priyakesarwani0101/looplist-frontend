import { 
  format, 
  differenceInDays, 
  isToday, 
  isBefore, 
  addDays, 
  parseISO, 
  eachDayOfInterval, 
  subDays,
  isWithinInterval
} from 'date-fns';
import { LoopCheck } from '../types';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const calculateStreak = (checks: LoopCheck[]): number => {
  if (!checks.length) return 0;
  
  // Sort checks by date (newest first)
  const sortedChecks = [...checks].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  // If today hasn't been checked yet, don't break the streak
  const todayCheck = sortedChecks.find(check => 
    isToday(new Date(check.date))
  );
  
  if (!todayCheck) {
    // Move to yesterday to start counting
    currentDate = subDays(currentDate, 1);
  }
  
  for (let i = 0; i < sortedChecks.length; i++) {
    const check = sortedChecks[i];
    const checkDate = new Date(check.date);
    
    // If the check is for the current day and is completed
    if (format(checkDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') && check.completed) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } 
    // If the check is for the current day but not completed, or there's a gap
    else {
      break;
    }
  }
  
  return streak;
};

export const calculateLongestStreak = (checks: LoopCheck[]): number => {
  if (!checks.length) return 0;
  
  // Sort checks by date
  const sortedChecks = [...checks].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate: Date | null = null;
  
  sortedChecks.forEach(check => {
    const checkDate = new Date(check.date);
    
    if (check.completed) {
      if (!previousDate || differenceInDays(checkDate, previousDate) === 1) {
        // Consecutive day completed
        currentStreak++;
      } else if (differenceInDays(checkDate, previousDate) > 1) {
        // Streak broken
        currentStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = checkDate;
    } else {
      // Reset streak on missed day
      currentStreak = 0;
      previousDate = null;
    }
  });
  
  return longestStreak;
};

export const calculateCompletionRate = (checks: LoopCheck[]): number => {
  if (!checks.length) return 0;
  
  const completedCount = checks.filter(check => check.completed).length;
  return (completedCount / checks.length) * 100;
};

export const generateHeatmapData = (checks: LoopCheck[], startDate: string, days: number = 90) => {
  const start = subDays(new Date(), days);
  const end = new Date();
  
  // Generate an array of the last 'days' days
  const dateInterval = eachDayOfInterval({ start, end });
  
  // Create a map for quick lookup of checks by date
  const checkMap = new Map<string, boolean>();
  
  checks.forEach(check => {
    checkMap.set(format(new Date(check.date), 'yyyy-MM-dd'), check.completed);
  });
  
  // Create the heatmap data
  return dateInterval.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const startDateObj = parseISO(startDate);
    
    // Check if the date is before the start date
    const isBeforeStart = isBefore(date, startDateObj);
    
    return {
      date: dateStr,
      value: isBeforeStart ? 'inactive' : (checkMap.has(dateStr) ? (checkMap.get(dateStr) ? 'completed' : 'missed') : 'empty')
    };
  });
};