import React from 'react';
import { format, parseISO, eachDayOfInterval, getMonth, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { LoopCheck } from '../../types';
import { generateHeatmapData } from '../../utils/date-utils';

interface LoopCalendarProps {
  checks: LoopCheck[];
  startDate: string;
}

export const LoopCalendar: React.FC<LoopCalendarProps> = ({ checks, startDate }) => {
  const heatmapData = generateHeatmapData(checks, startDate);
  
  // Group the heatmap data by month for visualization
  const monthsData = React.useMemo(() => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 2);
    
    const monthInterval = eachDayOfInterval({
      start: startOfMonth(threeMonthsAgo),
      end: endOfMonth(today)
    });
    
    // Group days by month
    const months: { [key: string]: typeof heatmapData } = {};
    
    monthInterval.forEach(date => {
      const monthKey = format(date, 'MMM yyyy');
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
    });
    
    // Map heatmap data to corresponding months
    heatmapData.forEach(day => {
      const date = parseISO(day.date);
      const monthKey = format(date, 'MMM yyyy');
      if (months[monthKey]) {
        if (!months[monthKey].find(d => d.date === day.date)) {
          months[monthKey].push(day);
        }
      }
    });
    
    return Object.entries(months).sort((a, b) => {
      return parseISO(b[0]).getTime() - parseISO(a[0]).getTime();
    });
  }, [heatmapData]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Activity Calendar</h3>
      
      <div className="space-y-6">
        {monthsData.map(([month, days]) => (
          <div key={month} className="space-y-2">
            <h4 className="font-medium text-gray-700">{month}</h4>
            <MonthCalendar month={month} days={days} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface MonthCalendarProps {
  month: string;
  days: Array<{ date: string; value: string }>;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ month, days }) => {
  // First day of the month to calculate offset
  const firstDate = days.length > 0 ? parseISO(days[0].date) : new Date();
  const monthStart = startOfMonth(firstDate);
  const dayOfWeek = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
  
  // Create day squares for the calendar
  const daySquares = React.useMemo(() => {
    const result = [];
    
    // Add empty squares for the days before the month starts
    for (let i = 0; i < dayOfWeek; i++) {
      result.push(
        <div key={`empty-${i}`} className="w-6 h-6"></div>
      );
    }
    
    // Add squares for each day in the month
    days.forEach(day => {
      const date = parseISO(day.date);
      const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      
      let bgColor = 'bg-gray-100';
      
      if (day.value === 'completed') {
        bgColor = 'bg-green-500';
      } else if (day.value === 'missed') {
        bgColor = 'bg-red-400';
      } else if (day.value === 'empty') {
        bgColor = 'bg-gray-100';
      } else if (day.value === 'inactive') {
        bgColor = 'bg-gray-50';
      }
      
      result.push(
        <div 
          key={day.date} 
          className={`w-6 h-6 rounded-sm ${bgColor} ${isToday ? 'ring-2 ring-offset-1 ring-purple-400' : ''}`} 
          title={`${format(date, 'MMM d')}: ${day.value === 'completed' ? 'Completed' : day.value === 'missed' ? 'Missed' : 'Not tracked yet'}`}
        />
      );
    });
    
    return result;
  }, [days, dayOfWeek]);
  
  return (
    <div className="inline-grid grid-cols-7 gap-1.5">
      {/* Week day labels */}
      <div className="text-xs text-center text-gray-500">S</div>
      <div className="text-xs text-center text-gray-500">M</div>
      <div className="text-xs text-center text-gray-500">T</div>
      <div className="text-xs text-center text-gray-500">W</div>
      <div className="text-xs text-center text-gray-500">T</div>
      <div className="text-xs text-center text-gray-500">F</div>
      <div className="text-xs text-center text-gray-500">S</div>
      
      {/* Calendar days */}
      {daySquares}
    </div>
  );
};