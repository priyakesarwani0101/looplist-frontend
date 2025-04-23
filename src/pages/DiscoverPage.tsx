import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loopService } from '../services/api';
import { Loop, Reaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Smile, Copy } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { EmojiPicker } from '../components/ui/EmojiPicker';

interface LoopWithReactions extends Loop {
  reactions: Reaction[];
}

export const DiscoverPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loops, setLoops] = useState<LoopWithReactions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<LoopWithReactions | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchPublicLoops = async () => {
      try {
        setIsLoading(true);
        const publicLoops = await loopService.getPublicLoops();
        
        // Fetch reactions for each loop
        const loopsWithReactions = await Promise.all(
          publicLoops.map(async (loop) => {
            const reactions = await loopService.getLoopReactions(loop.id);
            return { ...loop, reactions };
          })
        );
        
        setLoops(loopsWithReactions);
      } catch (err) {
        setError('Failed to fetch public loops');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicLoops();
  }, []);

  const handleReaction = async (loopId: string, emoji: string) => {
    if (!isAuthenticated) return;
    try {
      await loopService.addReaction(loopId, emoji);
      // Refresh the loops to update reactions
      const updatedLoops = await Promise.all(
        loops.map(async (loop) => {
          if (loop.id === loopId) {
            const reactions = await loopService.getLoopReactions(loopId);
            return { ...loop, reactions };
          }
          return loop;
        })
      );
      setLoops(updatedLoops);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const handleClone = async (loopId: string) => {
    if (!isAuthenticated) return;
    try {
      await loopService.cloneLoop(loopId);
      alert('Loop cloned successfully!');
    } catch (err) {
      console.error('Failed to clone loop:', err);
      alert('Failed to clone loop. Please try again.');
    }
  };

  // Group reactions by emoji and count
  const getReactionCounts = (reactions: Reaction[]) => {
    const counts = reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([emoji, count]) => ({
      emoji,
      count
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (loops.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No public loops found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Public Loops</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loops.map((loop) => {
          const reactionCounts = getReactionCounts(loop.reactions || []);
          
          return (
            <Card key={loop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{loop.emoji}</span>
                    <span>{loop.title}</span>
                  </CardTitle>
                  {reactionCounts.length > 0 && (
                    <div className="flex gap-1">
                      {reactionCounts.map(({ emoji, count }) => (
                        <div
                          key={emoji}
                          className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          <span className="text-lg">{emoji}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Frequency</p>
                    <p className="font-medium">{loop.frequency}</p>
                  </div>
                  {/* <div>
                    <p className="text-sm text-gray-500">Created by</p>
                    <p className="font-medium">{loop.creator?.name || 'Anonymous'}</p>
                  </div> */}
                  <div>
                    <p className="text-sm text-gray-500">Started</p>
                    <p className="font-medium">
                      {new Date(loop.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  {isAuthenticated && (
                    <div className="flex gap-2 pt-4">
                      <Dialog.Root open={showEmojiPicker && selectedLoop?.id === loop.id} onOpenChange={setShowEmojiPicker}>
                        <Dialog.Trigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => setSelectedLoop(loop)}
                          >
                            <Smile className="h-4 w-4" />
                            React
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
                            <Dialog.Title className="text-lg font-medium mb-4">Choose an emoji</Dialog.Title>
                            <EmojiPicker
                              onSelect={(emoji: string) => {
                                handleReaction(loop.id, emoji);
                                setShowEmojiPicker(false);
                              }}
                            />
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleClone(loop.id)}
                      >
                        <Copy className="h-4 w-4" />
                        Clone
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};