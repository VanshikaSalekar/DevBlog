
import React, { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
  id?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  id, 
  tags, 
  setTags, 
  placeholder = "Add tags..." 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().replace(/,/g, '');
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      
      <Input 
        id={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => inputValue.trim() && addTag()}
      />
      <div className="text-xs text-muted-foreground mt-1">
        Press Enter or comma to add a tag (max 10)
      </div>
    </div>
  );
};
