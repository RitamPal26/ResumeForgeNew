import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      if (fcpEntry) {
        metricsRef.current.fcp = fcpEntry.startTime;
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }
    };

    // Largest Contentful Paint
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.lcp = lastEntry.startTime;
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      return observer;
    };

    // First Input Delay
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metricsRef.current.fid = entry.processingStart - entry.startTime;
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }

      return observer;
    };

    // Cumulative Layout Shift
    const observeCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metricsRef.current.cls = clsValue;
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }

      return observer;
    };

    // Initialize measurements
    measureWebVitals();
    const lcpObserver = observeLCP();
    const fidObserver = observeFID();
    const clsObserver = observeCLS();

    // Report metrics after page load
    const reportMetrics = () => {
      setTimeout(() => {
        const metrics = metricsRef.current;
        
        // Log metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🚀 Performance Metrics');
          console.log('First Contentful Paint (FCP):', metrics.fcp?.toFixed(2), 'ms');
          console.log('Largest Contentful Paint (LCP):', metrics.lcp?.toFixed(2), 'ms');
          console.log('First Input Delay (FID):', metrics.fid?.toFixed(2), 'ms');
          console.log('Cumulative Layout Shift (CLS):', metrics.cls?.toFixed(4));
          console.log('Time to First Byte (TTFB):', metrics.ttfb?.toFixed(2), 'ms');
          console.groupEnd();
        }

        // Send to analytics in production
        if (process.env.NODE_ENV === 'production') {
          // Example: Send to Google Analytics, DataDog, etc.
          // gtag('event', 'web_vitals', {
          //   fcp: metrics.fcp,
          //   lcp: metrics.lcp,
          //   fid: metrics.fid,
          //   cls: metrics.cls,
          //   ttfb: metrics.ttfb,
          // });
        }
      }, 2000);
    };

    window.addEventListener('load', reportMetrics);

    return () => {
      lcpObserver?.disconnect();
      fidObserver?.disconnect();
      clsObserver?.disconnect();
      window.removeEventListener('load', reportMetrics);
    };
  }, []);

  return metricsRef.current;
}

// Hook for monitoring component render performance
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>();
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    renderCountRef.current += 1;
  });

  useEffect(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `🎨 ${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`
        );
      }

      // Warn about slow renders
      if (renderTime > 16) {
        console.warn(
          `⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    }
  });
}

// Hook for measuring custom performance marks
export function usePerformanceMark() {
  const mark = (name: string) => {
    performance.mark(name);
  };

  const measure = (name: string, startMark: string, endMark?: string) => {
    if (endMark) {
      performance.measure(name, startMark, endMark);
    } else {
      performance.measure(name, startMark);
    }

    const measure = performance.getEntriesByName(name, 'measure')[0];
    return measure?.duration;
  };

  const clearMarks = (name?: string) => {
    if (name) {
      performance.clearMarks(name);
    } else {
      performance.clearMarks();
    }
  };

  const clearMeasures = (name?: string) => {
    if (name) {
      performance.clearMeasures(name);
    } else {
      performance.clearMeasures();
    }
  };

  return {
    mark,
    measure,
    clearMarks,
    clearMeasures,
  };
}