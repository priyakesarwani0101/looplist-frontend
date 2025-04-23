import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { loopService } from '../../services/api';
import { Loop } from '../../types';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, BarChart2 } from 'lucide-react';
import { LoopTrackingModal } from './LoopTrackingModal';

export const LoopList: React.FC = () => {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const data = await loopService.getLoops();
        setLoops(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch loops. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoops();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  if (loops.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't created any loops yet.</p>
      </div>
    );
  }

  return (
    <>
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
                    onClick={() => setSelectedLoopId(loop.id)}
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => navigate(`/edit/${loop.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    className="p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      // Implement delete logic here
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Frequency: {loop.frequency}</p>
                <p>Start Date: {new Date(loop.startDate).toLocaleDateString()}</p>
                <p>Visibility: {loop.visibility}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLoopId && (
        <LoopTrackingModal
          loopId={selectedLoopId}
          isOpen={!!selectedLoopId}
          onClose={() => setSelectedLoopId(null)}
        />
      )}
    </>
  );
}; 