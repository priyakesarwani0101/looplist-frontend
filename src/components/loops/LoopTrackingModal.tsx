import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { loopService, HeatmapData } from '../../services/api';
import { Loop } from '../../types';
import { LoopCalendar } from './LoopCalendar';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

interface LoopTrackingModalProps {
  loopId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface LoopStatsResponse {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
  status: 'active' | 'broken' | 'completed';
}

export const LoopTrackingModal: React.FC<LoopTrackingModalProps> = ({
  loopId,
  isOpen,
  onClose,
}) => {
  const [loop, setLoop] = useState<Loop | null>(null);
  const [stats, setStats] = useState<LoopStatsResponse | null>(null);
  const [checks, setChecks] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoopDetails = async () => {
      try {
        setIsLoading(true);
        const loops = await loopService.getLoops();
        const foundLoop = loops.find((l: Loop) => l.id === loopId);
        if (!foundLoop) {
          throw new Error('Loop not found');
        }
        setLoop(foundLoop);
        
        const loopStats = await loopService.getLoopStats(loopId);
        setStats(loopStats);

        const heatmapData = await loopService.getLoopHeatmap(loopId);
        setChecks(heatmapData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch loop details');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && loopId) {
      fetchLoopDetails();
    }
  }, [isOpen, loopId]);

  const handleCheckIn = async (status: 'completed' | 'skipped') => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      await loopService.checkIn(loopId, today, status);
      
      // Update the checks array with the new check-in
      setChecks(prevChecks => {
        const updatedChecks = prevChecks.filter(check => check.date !== today);
        return [...updatedChecks, { date: today, status, count: 1 }];
      });

      // Refresh the stats
      const loopStats = await loopService.getLoopStats(loopId);
      setStats(loopStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    }
  };

  const todayCheck = checks.find(check => check.date === format(new Date(), 'yyyy-MM-dd'));
  const isCompleted = todayCheck?.status === 'completed';
  const isSkipped = todayCheck?.status === 'skipped';

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className='className="flex items-center gap-2'>
          {loop && (
              <>
                <span className="text-2xl">{loop.emoji}</span>
                <span className='text-white'>{loop.title}</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : loop && stats ? (
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Streak</p>
                      <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Longest Streak</p>
                      <p className="text-2xl font-bold">{stats.longestStreak} days</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Days</p>
                      <p className="text-2xl font-bold">{stats.totalDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-2xl font-bold">{stats?.completionRate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-2xl font-bold capitalize">{stats.status}</p>
                  </div>

                  {/* Today's Check-in */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Today's Check-in</p>
                    <div className="flex gap-2">
                      <Button
                        className={`flex-1 ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        onClick={() => handleCheckIn('completed')}
                        disabled={isCompleted || isSkipped}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {isCompleted ? 'Completed' : 'Mark as Done'}
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 ${isSkipped ? 'bg-yellow-100 hover:bg-yellow-200' : ''}`}
                        onClick={() => handleCheckIn('skipped')}
                        disabled={isCompleted || isSkipped}
                      >
                        <X className="h-4 w-4 mr-2" />
                        {isSkipped ? 'Skipped' : 'Skip Today'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <LoopCalendar checks={checks} />
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}; 