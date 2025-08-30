"use client";

import { useState, useEffect, useRef } from "react";

interface TypingOptions {
  speed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
}

export function useTypingEffect(
  words: string[],
  options: TypingOptions = {}
) {
  const {
    speed = 100,
    deleteSpeed = 50,
    delayBetweenWords = 2000,
    loop = true,
  } = options;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[currentWordIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setCurrentText(prev => prev.slice(0, -1));
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex(prev => {
            const nextIndex = (prev + 1) % words.length;
            if (nextIndex === 0 && !loop) {
              setIsCompleted(true);
              return prev;
            }
            return nextIndex;
          });
        }
      } else {
        setCurrentText(prev => currentWord.slice(0, prev.length + 1));
        
        if (currentText === currentWord) {
          if (currentWordIndex === words.length - 1 && !loop) {
            setIsCompleted(true);
            return;
          }
          
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenWords);
          return;
        }
      }

      const timeout = isDeleting ? deleteSpeed : speed;
      timeoutRef.current = setTimeout(handleTyping, timeout);
    };

    if (!isCompleted) {
      timeoutRef.current = setTimeout(handleTyping, isDeleting ? deleteSpeed : speed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    words,
    currentWordIndex,
    currentText,
    isDeleting,
    isCompleted,
    speed,
    deleteSpeed,
    delayBetweenWords,
    loop,
  ]);

  const restart = () => {
    setCurrentWordIndex(0);
    setCurrentText("");
    setIsDeleting(false);
    setIsCompleted(false);
  };

  return {
    text: currentText,
    isCompleted,
    restart,
  };
}
