'use client';

import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Variantes d'animation prédéfinies
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 }
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const rotateVariants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { opacity: 1, rotate: 0 }
};

// Composant AnimatedWrapper pour les animations au scroll
interface AnimatedWrapperProps {
  children: React.ReactNode;
  variants?: {
    hidden?: Record<string, number | string | number[] | string[]>;
    visible?: Record<string, number | string | number[] | string[]>;
  };
  initial?: string;
  animate?: string;
  transition?: Record<string, unknown>;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
}

export function AnimatedWrapper({
  children,
  variants = fadeInVariants,
  initial = "hidden",
  animate = "visible",
  transition = { duration: 0.6, ease: "easeOut" },
  className = "",
  delay = 0,
  duration,
  once = true,
  margin = "-100px"
}: AnimatedWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  const finalTransition = duration ? { ...transition, duration } : transition;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ ...finalTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour les animations staggered (en cascade)
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1, 
  className = "" 
}: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour les animations au hover
interface HoverAnimationProps {
  children: React.ReactNode;
  hoverScale?: number;
  hoverRotate?: number;
  hoverY?: number;
  className?: string;
}

export function HoverAnimation({
  children,
  hoverScale = 1.05,
  hoverRotate = 0,
  hoverY = 0,
  className = ""
}: HoverAnimationProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        rotate: hoverRotate,
        y: hoverY
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour les animations de texte (typewriter)
interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypewriterText({ 
  text, 
  className = "", 
  speed = 0.05 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, speed * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// Hook pour les animations de parallaxe
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return { ref, y };
}

// Composant pour les animations de nombre (compteur)
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  from,
  to,
  duration = 2,
  className = "",
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      setCount(Math.floor(from + (to - from) * progress));
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

// Composant pour les animations de page transition
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Export des utilitaires
export const animationUtils = {
  fadeIn: fadeInVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  rotate: rotateVariants
};