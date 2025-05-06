
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: theme === 'light' ? 1 : 0, rotate: theme === 'light' ? 0 : 45 }}
        animate={{ opacity: theme === 'light' ? 1 : 0, rotate: theme === 'light' ? 0 : 45 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </motion.svg>
      
      {/* Moon icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : -45 }}
        animate={{ opacity: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : -45 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </motion.svg>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
