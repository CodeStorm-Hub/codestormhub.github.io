"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface LazyLoadProps {
  children: ReactNode;
  height?: string | number;
  offset?: string;
  placeholder?: ReactNode;
  className?: string;
}

export function LazyLoad({ 
  children, 
  height = "auto", 
  offset = "200px", 
  placeholder,
  className = "" 
}: LazyLoadProps) {
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true);
          // Unobserve after first load
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        rootMargin: offset,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [offset]);

  return (
    <div
      ref={ref}
      className={`${className} ${!hasBeenInView && height !== "auto" ? "min-h-[200px]" : ""}`}
    >
      {hasBeenInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      ) : (
        placeholder || (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[200px]" />
        )
      )}
    </div>
  );
}

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    // Web Vitals measurement
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "paint" && entry.name === "first-contentful-paint") {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
        
        if (entry.entryType === "largest-contentful-paint") {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        
        if (entry.entryType === "layout-shift") {
          const layoutShiftEntry = entry as PerformanceEntry & { 
            hadRecentInput?: boolean; 
            value: number; 
          };
          if (!layoutShiftEntry.hadRecentInput) {
            setMetrics(prev => ({ 
              ...prev, 
              cls: (prev.cls || 0) + layoutShiftEntry.value 
            }));
          }
        }
        
        if (entry.entryType === "first-input") {
          const firstInputEntry = entry as PerformanceEntry & { 
            processingStart: number; 
          };
          setMetrics(prev => ({ ...prev, fid: firstInputEntry.processingStart - firstInputEntry.startTime }));
        }
      }
    });

    observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "layout-shift", "first-input"] });

    // Log performance data in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        console.log("Performance Metrics:", metrics);
      }, 3000);
    }

    return () => observer.disconnect();
  }, [metrics]);

  // Component doesn't render anything visible
  return null;
}

export function PreloadCriticalResources() {
  useEffect(() => {
    // Preload critical images and fonts
    const criticalResources = [
      // Add your critical image URLs here
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=entropy&auto=format",
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = resource;
      document.head.appendChild(link);
    });

    // Prefetch DNS for external domains
    const dnsPrefetchDomains = [
      "images.unsplash.com",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}

const PerformanceComponents = { LazyLoad, PerformanceMonitor, PreloadCriticalResources };

export default PerformanceComponents;
