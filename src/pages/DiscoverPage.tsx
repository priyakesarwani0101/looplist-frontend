import React, { useState, useEffect } from 'react';
import { LoopCard } from '../components/loops/LoopCard';
import { Loop, User, Reaction } from '../types';
import { getPublicLoops, getUserById, getLoopReactions } from '../services/mockData';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const DiscoverPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [publicLoops, setPublicLoops] = useState<Loop[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch public loops
    const loops = getPublicLoops();
    setPublicLoops(loops);
    
    // Fetch users and reactions for each loop
    const userMap: Record<string, User> = {};
    const reactionMap: Record<string, Reaction[]> = {};
    
    loops.forEach(loop => {
      if (!userMap[loop.userId]) {
        const user = getUserById(loop.userId);
        if (user) {
          userMap[loop.userId] = user;
        }
      }
      
      // Get reactions for this loop
      reactionMap[loop.id] = getLoopReactions(loop.id);
    });
    
    setUsers(userMap);
    setReactions(reactionMap);
    setIsLoading(false);
  }, []);
  
  // Filter loops based on search query
  const filteredLoops = publicLoops.filter(loop => 
    loop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (users[loop.userId]?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCloneLoop = (loopId: string) => {
    // In a real app, this would clone the loop for the current user
    alert(`Loop ${loopId} cloned! Check your dashboard.`);
  };
  
  const handleReact = (loopId: string, emoji: string) => {
    // In a real app, this would add a reaction to the loop
    alert(`Reacted with ${emoji} to loop ${loopId}`);
    
    // Update local state
    setReactions(prev => ({
      ...prev,
      [loopId]: [
        ...(prev[loopId] || []),
        {
          id: `reaction-${Date.now()}`,
          loopId,
          userId: 'current-user', // This would be the actual user ID in a real app
          emoji,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Group loops by trending and recent
  const trendingLoops = [...filteredLoops].sort(() => Math.random() - 0.5).slice(0, 3);
  const otherLoops = filteredLoops.filter(loop => !trendingLoops.find(t => t.id === loop.id));
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Discover Loops</h1>
        
        <div className="w-full md:w-72">
          <Input
            placeholder="Search for habits or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
      </div>
      
      {/* Trending Loops */}
      {trendingLoops.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium">Trending Now</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trendingLoops.map(loop => (
              <LoopCard
                key={loop.id}
                loop={loop}
                user={users[loop.userId]}
                isPublic
                onClone={isAuthenticated ? () => handleCloneLoop(loop.id) : undefined}
                onReact={isAuthenticated ? (emoji) => handleReact(loop.id, emoji) : undefined}
                currentReactions={reactions[loop.id]?.map(r => r.emoji) || []}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* All Public Loops */}
      {otherLoops.length > 0 ? (
        <div>
          <h2 className="text-lg font-medium mb-4">Browse All</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherLoops.map(loop => (
              <LoopCard
                key={loop.id}
                loop={loop}
                user={users[loop.userId]}
                isPublic
                onClone={isAuthenticated ? () => handleCloneLoop(loop.id) : undefined}
                onReact={isAuthenticated ? (emoji) => handleReact(loop.id, emoji) : undefined}
                currentReactions={reactions[loop.id]?.map(r => r.emoji) || []}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No habits found matching your search.</p>
        </div>
      )}
    </div>
  );
};