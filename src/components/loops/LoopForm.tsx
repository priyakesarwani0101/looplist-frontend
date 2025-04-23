import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FrequencyType, PrivacyType } from '../../types';
import { Calendar, Lock, Eye, Users } from 'lucide-react';

const frequencyOptions: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays only' },
  { value: '3x-week', label: '3 times per week' },
  { value: 'custom', label: 'Custom schedule' }
];

const privacyOptions: { value: PrivacyType; label: string; icon: React.ReactNode }[] = [
  { value: 'private', label: 'Private', icon: <Lock className="h-4 w-4" /> },
  { value: 'public', label: 'Public', icon: <Eye className="h-4 w-4" /> },
  { value: 'friends', label: 'Friends only', icon: <Users className="h-4 w-4" /> }
];

// Common emojis for habits
const commonEmojis = ['📚', '🧘', '🏃‍♂️', '💧', '🥗', '🍎', '💪', '🧠', '💊', '🛌', '❤️', '🎯'];

export const LoopForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState({
    title: '',
    frequency: 'daily' as FrequencyType,
    startDate: new Date().toISOString().split('T')[0], // Today in YYYY-MM-DD format
    privacy: 'private' as PrivacyType,
    emoji: '🔄'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setFormState(prev => ({ ...prev, emoji }));
  };
  
  const handlePrivacySelect = (privacy: PrivacyType) => {
    setFormState(prev => ({ ...prev, privacy }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to dashboard after form submission
    navigate('/dashboard');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a new Loop</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Input
              label="What's your micro-habit?"
              name="title"
              id="title"
              placeholder="e.g., Read 10 pages daily"
              value={formState.title}
              onChange={handleInputChange}
              required
            />
            <p className="text-sm text-gray-500">
              Keep it specific and achievable
            </p>
          </div>
          
          {/* Emoji Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Choose an icon
            </label>
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-xl transition-colors ${
                    formState.emoji === emoji ? 'bg-purple-100 border-2 border-purple-500' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Frequency */}
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              How often?
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formState.frequency}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Start Date */}
          <div>
            <Input
              label="Start date"
              type="date"
              name="startDate"
              id="startDate"
              value={formState.startDate}
              onChange={handleInputChange}
              leftIcon={<Calendar className="h-4 w-4 text-gray-500" />}
            />
          </div>
          
          {/* Privacy */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Privacy
            </label>
            <div className="flex space-x-2">
              {privacyOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    formState.privacy === option.value
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                  onClick={() => handlePrivacySelect(option.value)}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {formState.privacy === 'private' && 'Only you can see this loop'}
              {formState.privacy === 'public' && 'Everyone can see and interact with this loop'}
              {formState.privacy === 'friends' && 'Only your friends can see this loop'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            disabled={!formState.title.trim()}
          >
            Create Loop
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};