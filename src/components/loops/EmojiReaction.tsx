import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Smile } from 'lucide-react';

const EMOJIS = ['👍', '❤️', '🔥', '🎉', '💪', '🌟', '🙌', '👏'];

interface EmojiReactionProps {
  onReact: (emoji: string) => void;
  currentReactions?: string[];
}

export const EmojiReaction: React.FC<EmojiReactionProps> = ({
  onReact,
  currentReactions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Smile className="h-4 w-4" />}
        >
          React
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className={`text-xl p-2 rounded-full hover:bg-gray-100 transition-colors ${
                currentReactions.includes(emoji) ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                onReact(emoji);
                setIsOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 