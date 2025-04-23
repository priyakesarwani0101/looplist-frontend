import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { loopService } from '../services/api';
import { Loop } from '../types';
import { UpdateLoopRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Common emojis for loops
const emojiOptions = [
'📚', '🧘', '🏃‍♂️', '💧', '🥗', '🍎', '💪', '🧠', '💊', '🛌', '❤️', '🎯'
];

export const EditLoopPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loop, setLoop] = useState<Loop | null>(null);
  const [formData, setFormData] = useState<UpdateLoopRequest>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchLoop = async () => {
      try {
        const loops = await loopService.getLoops();
        const currentLoop = loops.find(l => l.id === id);
        if (!currentLoop) {
          setError('Loop not found');
          return;
        }
        setLoop(currentLoop);
        setFormData({
          title: currentLoop.title,
          frequency: currentLoop.frequency,
          visibility: currentLoop.visibility,
          emoji: currentLoop.emoji
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch loop details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoop();
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await loopService.updateLoop(id, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to update loop');
    }
  };

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

  if (!loop) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Loop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji
              </label>
              <div className="grid grid-cols-8 gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`text-2xl p-2 rounded-md transition-colors ${
                      formData.emoji === emoji
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setFormData({ ...formData, emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <Select
                id="frequency"
                value={formData.frequency || ''}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                required
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </div>

            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                Visibility
              </label>
              <Select
                id="visibility"
                value={formData.visibility || ''}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })}
                required
              >
                <option value="">Select visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 