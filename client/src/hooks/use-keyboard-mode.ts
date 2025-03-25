import { useEffect } from 'react';

/**
 * Hook to detect keyboard vs mouse navigation and add appropriate class to body
 * This helps style focus states differently for keyboard vs mouse users
 */
export function useKeyboardMode() {
  useEffect(() => {
    // Function to add keyboard-user class when Tab key is used
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    };

    // Function to remove keyboard-user class when mouse is used
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-user');
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
}