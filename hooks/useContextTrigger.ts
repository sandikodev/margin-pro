import React, { useState, useRef, useCallback } from 'react';

interface UseContextTriggerProps {
  onTrigger: (coords: { x: number; y: number }) => void;
  longPressDelay?: number;
  disableVibrate?: boolean;
}

export const useContextTrigger = ({ 
  onTrigger, 
  longPressDelay = 600,
  disableVibrate = false 
}: UseContextTriggerProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number, y: number } | null>(null);
  const isTriggered = useRef(false);

  const startPress = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Only handle touch events for long press visual
    if (e.type === 'mousedown') return; 

    isTriggered.current = false;
    setIsPressing(true);
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        startPos.current = { x: clientX, y: clientY };
    }

    timeoutRef.current = setTimeout(() => {
      if (!disableVibrate && navigator.vibrate) navigator.vibrate(50);
      onTrigger({ x: clientX, y: clientY });
      isTriggered.current = true;
      setIsPressing(false);
    }, longPressDelay);
  }, [onTrigger, longPressDelay, disableVibrate]);

  const cancelPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPressing(false);
    startPos.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startPos.current) return;
    
    const moveX = Math.abs(e.touches[0].clientX - startPos.current.x);
    const moveY = Math.abs(e.touches[0].clientY - startPos.current.y);

    // Cancel if moved more than 10px (scrolling or swiping)
    if (moveX > 10 || moveY > 10) {
      cancelPress();
    }
  }, [cancelPress]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Desktop interaction: Right Click
    e.preventDefault(); // Prevent native browser menu
    e.stopPropagation();
    onTrigger({ x: e.clientX, y: e.clientY });
  }, [onTrigger]);

  return {
    isPressing,
    triggerProps: {
      onTouchStart: startPress,
      onTouchMove: handleTouchMove,
      onTouchEnd: cancelPress,
      onContextMenu: handleContextMenu,
    }
  };
};