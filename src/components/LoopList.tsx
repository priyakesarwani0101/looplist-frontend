import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Loop } from '../types';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

interface LoopListProps {
  loops: Loop[];
  onDelete?: (loopId: string) => void;
}

export const LoopList: React.FC<LoopListProps> = ({ loops, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loops.map((loop) => (
        <Card key={loop.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{loop.emoji}</span>
                <span>{loop.title}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => navigate(`/edit/${loop.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    className="p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => onDelete(loop.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Frequency: {loop.frequency}</p>
              <p>Visibility: {loop.visibility}</p>
              <p>Start Date: {new Date(loop.startDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 