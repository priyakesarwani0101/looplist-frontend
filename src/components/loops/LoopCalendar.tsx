import React from 'react';
import { format, parseISO, eachDayOfInterval, getDay, subMonths } from 'date-fns';
import { HeatmapData } from '../../services/api';
import * as Tooltip from '@radix-ui/react-tooltip';

interface LoopCalendarProps {
  checks: HeatmapData[];
}

export const LoopCalendar: React.FC<LoopCalendarProps> = ({ checks }) => {
  // Get the date range for the last 3 months
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 2); // This will give us current month + 2 previous months
  
  // Create a map for quick lookup of check values
  const checkMap = new Map<string, HeatmapData>();
  checks.forEach(check => {
    checkMap.set(check.date, check);
  });
  
  // Generate all days for the last 3 months
  const monthDays = eachDayOfInterval({ start: threeMonthsAgo, end: today });
  
  // Group days by month
  const monthsData = React.useMemo(() => {
    const months: { [key: string]: Array<{ date: string; status: HeatmapData['status'] }> } = {};
    
    monthDays.forEach(date => {
      const monthKey = format(date, 'MMM yyyy');
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      
      const dateStr = format(date, 'yyyy-MM-dd');
      const check = checkMap.get(dateStr);
      
      months[monthKey].push({
        date: dateStr,
        status: check?.status ?? 'missed'
      });
    });
    
    return Object.entries(months).sort((a, b) => {
      return parseISO(b[0]).getTime() - parseISO(a[0]).getTime();
    });
  }, [monthDays, checkMap]);
  
  // Get the color based on the status
  const getColor = (status: HeatmapData['status']) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'skipped') return 'bg-yellow-400';
    if (status === 'missed') return 'bg-red-400';
    return 'bg-gray-100';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Activity Calendar</h3>
      
      {/* Week day labels */}
      <div className="flex gap-2 mb-2">
        <div className="w-4 text-xs text-center text-gray-500">S</div>
        <div className="w-4 text-xs text-center text-gray-500">M</div>
        <div className="w-4 text-xs text-center text-gray-500">T</div>
        <div className="w-4 text-xs text-center text-gray-500">W</div>
        <div className="w-4 text-xs text-center text-gray-500">T</div>
        <div className="w-4 text-xs text-center text-gray-500">F</div>
        <div className="w-4 text-xs text-center text-gray-500">S</div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {monthsData.map(([month, days]) => (
          <div key={month} className="space-y-2">
            <h4 className="font-medium text-gray-700 text-sm">{month}</h4>
            <MonthCalendar days={days} getColor={getColor} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface MonthCalendarProps {
  days: Array<{ date: string; status: HeatmapData['status'] }>;
  getColor: (status: HeatmapData['status']) => string;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ days, getColor }) => {
  const firstDate = days.length > 0 ? parseISO(days[0].date) : new Date();
  const monthStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  const dayOfWeek = getDay(monthStart);
  
  const daySquares = React.useMemo(() => {
    const result = [];
    
    // Add empty squares for the days before the month starts
    for (let i = 0; i < dayOfWeek; i++) {
      result.push(
        <div key={`empty-${i}`} className="w-4 h-4"></div>
      );
    }
    
    // Add squares for each day in the month
    days.forEach(day => {
      const date = parseISO(day.date);
      const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      
      result.push(
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div 
                key={day.date} 
                className={`w-4 h-4 rounded-sm ${getColor(day.status)} ${isToday ? 'ring-1 ring-offset-1 ring-purple-400' : ''} cursor-default`}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                sideOffset={5}
              >
                {format(date, 'MMMM d, yyyy')}: {day.status}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      );
    });
    
    return result;
  }, [days, dayOfWeek, getColor]);
  
  return (
    <div className="inline-grid grid-cols-7 gap-2">
      {daySquares}
    </div>
  );
};