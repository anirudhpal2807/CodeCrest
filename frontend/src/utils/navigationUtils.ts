import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

export const useThrottledNavigation = () => {
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);
  const timeoutRef = useRef<any>(null);
  const navigationCountRef = useRef(0);

  const throttledNavigate = useCallback((to: string, delay: number = 1500) => {
    navigationCountRef.current++;
    
    if (isNavigatingRef.current) {
      return false;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isNavigatingRef.current = true;
    
    try {
      // Use a small delay to prevent immediate navigation conflicts
      setTimeout(() => {
        navigate(to, { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Navigation error:', error);
      isNavigatingRef.current = false;
      return false;
    }

    timeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
      timeoutRef.current = null;
    }, delay);

    return true;
  }, [navigate]);

  const clearNavigationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isNavigatingRef.current = false;
  }, []);

  const forceNavigate = useCallback((to: string) => {
    clearNavigationTimeout();
    isNavigatingRef.current = false;
    navigate(to, { replace: true });
  }, [navigate, clearNavigationTimeout]);

  return {
    throttledNavigate,
    clearNavigationTimeout,
    forceNavigate,
    isNavigating: isNavigatingRef.current
  };
};
