import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LoopList } from '../components/loops/LoopList';
import { Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Loops</h1>
        <Button 
          as={Link} 
          to="/create"
          leftIcon={<Plus className="h-5 w-5" />}
        >
          New Loop
        </Button>
      </div>
      <LoopList />
    </div>
  );
};