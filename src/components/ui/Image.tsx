"use client";

import { useState } from "react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showLoadingState?: boolean;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export function Image({ 
  src, 
  alt, 
  fallbackSrc, 
  showLoadingState = true, 
  className = "",
  width = 600,
  height = 400,
  fill = false,
  priority = false,
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence>
        {showLoadingState && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </motion.div>
        )}
        
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"
          >
            <ImageOff className="w-8 h-8 mb-2" />
            <span className="text-sm text-center">Image failed to load</span>
          </motion.div>
        )}
      </AnimatePresence>

      <NextImage
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-all duration-300",
          isLoading && "opacity-0",
          hasError && "opacity-0",
          !isLoading && !hasError && "opacity-100"
        )}
      />
    </div>
  );
}

export default Image;
