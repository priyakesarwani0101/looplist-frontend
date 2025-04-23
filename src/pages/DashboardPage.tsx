import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LoopCard } from '../components/loops/LoopCard';
import { LoopCalendar } from '../components/loops/LoopCalendar';
import { useAuth } from '../context/AuthContext';
import { Loop, LoopStreak, LoopCheck } from '../types';
import { getUserLoops, getLoopChecks } from '../services/mockData';
import { calculateStreak, calculateLongestStreak, calculateCompletionRate } from '../utils/date-utils';
import { Plus, Flame } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loops, setLoops] = useState<Loop[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<Loop | null>(null);
  const [streaks, setStreaks] = useState<Record<string, LoopStreak>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Fetch user's loops
      const userLoops = getUserLoops(user.id);
      setLoops(userLoops);
      
      // Calculate streaks for each loop
      const streakData: Record<string, LoopStreak> = {};
      
      userLoops.forEach(loop => {
        const checks = getLoopChecks(loop.id);
        
        streakData[loop.id] = {
          loopId: loop.id,
          currentStreak: calculateStreak(checks),
          longestStreak: calculateLongestStreak(checks),
          completionRate: calculateCompletionRate(checks),
          checks
        };
      });
      
      setStreaks(streakData);
      
      // If we have loops, select the first one by default
      if (userLoops.length > 0) {
        setSelectedLoop(userLoops[0]);
      }
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleCheckIn = (loopId: string) => {
    if (!streaks[loopId]) return;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already a check for today
    const todayCheck = streaks[loopId].checks.find(check => check.date === today);
    
    // Update the check
    const updatedChecks = [...streaks[loopId].checks];
    
    if (todayCheck) {
      // Toggle the completed status
      const index = updatedChecks.findIndex(check => check.date === today);
      updatedChecks[index] = { ...todayCheck, completed: !todayCheck.completed };
    } else {
      // Create a new check for today
      updatedChecks.push({
        id: `check-${loopId}-${today}`,
        loopId,
        date: today,
        completed: true
      });
    }
    
    // Update streaks with the new check
    setStreaks(prev => ({
      ...prev,
      [loopId]: {
        ...prev[loopId],
        currentStreak: calculateStreak(updatedChecks),
        longestStreak: calculateLongestStreak(updatedChecks),
        completionRate: calculateCompletionRate(updatedChecks),
        checks: updatedChecks
      }
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (loops.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-16">
          <div className="inline-block bg-purple-100 p-3 rounded-full mb-4">
            <Flame className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No habits yet</h2>
          <p className="text-gray-600 mb-6">
            Start by creating your first micro-habit to track
          </p>
          <Button 
            as={Link} 
            to="/create" 
            size="lg"
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Create Your First Loop
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Loops</h1>
        <Button 
          as={Link} 
          to="/create"
          leftIcon={<Plus className="h-5 w-5" />}
        >
          New Loop
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Loops List */}
          <div>
            <h2 className="text-lg font-medium mb-3">Active Habits</h2>
            <div className="space-y-4">
              {loops.map(loop => (
                <LoopCard
                  key={loop.id}
                  loop={loop}
                  streak={streaks[loop.id]}
                  onCheckIn={() => handleCheckIn(loop.id)}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          {selectedLoop && streaks[selectedLoop.id] && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <span className="text-2xl mr-2">{selectedLoop.emoji || '🔄'}</span>
                  {selectedLoop.title}
                </h2>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <StatCard
                    label="Current Streak"
                    value={streaks[selectedLoop.id].currentStreak}
                    suffix="days"
                    icon={<Flame className="h-5 w-5 text-orange-500" />}
                  />
                  <StatCard
                    label="Longest Streak"
                    value={streaks[selectedLoop.id].longestStreak}
                    suffix="days"
                  />
                  <StatCard
                    label="Completion Rate"
                    value={Math.round(streaks[selectedLoop.id].completionRate)}
                    suffix="%"
                  />
                </div>
                
                <LoopCalendar 
                  checks={streaks[selectedLoop.id].checks}
                  startDate={selectedLoop.startDate}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix, icon }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm text-gray-500 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-lg ml-1 font-medium">{suffix}</span>}
      </div>
    </div>
  );
};