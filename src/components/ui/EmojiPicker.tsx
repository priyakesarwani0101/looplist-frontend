import React from 'react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJIS = ['👍', '❤️', '😊', '🎉', '🔥', '💪', '🌟', '💯'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}; 