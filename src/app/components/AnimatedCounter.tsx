"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

export default function AnimatedCounter({ 
  target, 
  duration = 2000,
  suffix = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start: number | null = null;
    const increment = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const value = Math.floor(percentage * target);
      
      setCount(value);
      
      if (progress < duration) {
        requestAnimationFrame(increment);
      }
    };
    
    requestAnimationFrame(increment);
  }, [target, duration, isVisible]);

  return (
    <span ref={counterRef} className="text-4xl font-bold text-vert mb-2">
      {count}{suffix}
    </span>
  );
}