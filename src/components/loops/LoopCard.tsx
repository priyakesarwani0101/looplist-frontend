import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loop, LoopStreak, User } from '../../types';
import { Flame, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EmojiReaction } from './EmojiReaction';

interface LoopCardProps {
  loop: Loop;
  streak?: LoopStreak;
  user?: User;
  isPublic?: boolean;
  onCheckIn?: () => void;
  onClone?: () => void;
  onReact?: (emoji: string) => void;
  currentReactions?: string[];
}

export const LoopCard: React.FC<LoopCardProps> = ({
  loop,
  streak,
  user,
  isPublic = false,
  onCheckIn,
  onClone,
  onReact,
  currentReactions = []
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Format frequency for display
  const formatFrequency = (freq: string): string => {
    switch (freq) {
      case 'daily': return 'Every day';
      case 'weekdays': return 'Weekdays only';
      case '3x-week': return '3 times per week';
      case 'custom': return 'Custom schedule';
      default: return freq;
    }
  };

  const handleAuthRequired = () => {
    navigate('/login');
  };

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full" 
      hoverEffect
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{loop.emoji || '🔄'}</span>
            <CardTitle>{loop.title}</CardTitle>
          </div>
          {streak && (
            <div className="flex items-center space-x-1.5 bg-orange-100 text-orange-700 rounded-full px-2.5 py-1">
              <Flame className={`h-4 w-4 ${streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{streak.currentStreak}</span>
            </div>
          )}
        </div>
        
        {isPublic && user && (
          <div className="flex items-center mt-2">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="h-5 w-5 rounded-full mr-2" 
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-200 mr-2" />
            )}
            <span className="text-sm text-gray-600">{user.name}</span>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-1">
          {formatFrequency(loop.frequency)}
          <span className="mx-2">•</span>
          Started {format(new Date(loop.startDate), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {streak && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-sm text-gray-500">Longest Streak</div>
              <div className="text-xl font-semibold">{streak.longestStreak}</div>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center">
              <div className="text-sm text-gray-500">Completion Rate</div>
              <div className="text-xl font-semibold">{Math.round(streak.completionRate)}%</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex space-x-2 border-t border-gray-100 pt-4">
        {onCheckIn && (
          <Button
            className={`flex-1 ${streak?.checks.some(c => c.date === format(new Date(), 'yyyy-MM-dd') && c.completed) ? 'bg-green-500 hover:bg-green-600' : ''}`}
            onClick={onCheckIn}
          >
            {streak?.checks.some(c => c.date === format(new Date(), 'yyyy-MM-dd') && c.completed) ? 'Completed' : 'Check In'}
          </Button>
        )}
        
        {isPublic && (
          <>
            {isAuthenticated ? (
              <>
                <EmojiReaction
                  onReact={onReact || (() => {})}
                  currentReactions={currentReactions}
                />
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Copy className="h-4 w-4" />}
                  onClick={onClone}
                >
                  Clone
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleAuthRequired}
              >
                Sign in to interact
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};