import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  active?: boolean;
  returnFocusOnDeactivate?: boolean;
}

/**
 * Hook to trap focus within a container for accessibility
 */
export function useFocusTrap({
  active = true,
  returnFocusOnDeactivate = true,
}: UseFocusTrapOptions = {}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    
    // Store the currently focused element so we can return to it later
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    return () => {
      // Return focus when the component unmounts
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, returnFocusOnDeactivate]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    
    // Find all focusable elements within the container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element when the trap is activated
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Tab key to keep focus within the container
      if (event.key === 'Tab') {
        // If Shift+Tab pressed on first element, move to last element
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } 
        // If Tab pressed on last element, move to first element
        else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
      
      // Handle Escape key to close modal if needed
      if (event.key === 'Escape') {
        // This could trigger a close callback if provided
        if (returnFocusOnDeactivate && previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, returnFocusOnDeactivate]);

  return containerRef;
}