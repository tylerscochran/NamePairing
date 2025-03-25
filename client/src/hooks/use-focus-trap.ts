import { useRef, useEffect } from 'react';

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
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element to restore later
    previousActiveElement.current = document.activeElement;

    // Focus the container itself if it's not yet focused
    const container = containerRef.current;
    if (container && !container.contains(document.activeElement)) {
      container.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!container || event.key !== 'Tab') return;

      // Get all focusable elements
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // If shift+tab on first element, move to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
      // If tab on last element, cycle back to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element when unmounting
      if (returnFocusOnDeactivate && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement)?.focus?.();
      }
    };
  }, [active, returnFocusOnDeactivate]);

  return containerRef;
}