import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedSkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'chart';
  width?: string | number;
  height?: string | number;
  lines?: number;
  rows?: number;
  animated?: boolean;
}

const pulseAnimation = {
  initial: { opacity: 0.6 },
  animate: { opacity: 1 },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  },
};

export function EnhancedSkeletonLoader({
  className = '',
  variant = 'text',
  width = '100%',
  height = '1rem',
  lines = 1,
  rows = 3,
  animated = true,
}: EnhancedSkeletonLoaderProps) {
  const baseClasses = 'bg-secondary-200 dark:bg-secondary-700 transition-colors duration-300';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
    table: 'rounded',
    chart: 'rounded-lg',
  };

  const SkeletonElement = ({ customWidth = width, customHeight = height, customClass = '' }) => (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${customClass} ${className}`}
      style={{ width: customWidth, height: customHeight }}
      {...(animated ? pulseAnimation : {})}
    />
  );

  switch (variant) {
    case 'text':
      if (lines > 1) {
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonElement
                key={index}
                customWidth={index === lines - 1 ? '75%' : width}
                customHeight={height}
              />
            ))}
          </div>
        );
      }
      return <SkeletonElement />;

    case 'card':
      return (
        <div className={`p-6 space-y-4 ${className}`}>
          <div className="flex items-center space-x-4">
            <SkeletonElement customWidth={48} customHeight={48} customClass="rounded-full" />
            <div className="space-y-2 flex-1">
              <SkeletonElement customWidth="60%" customHeight="1rem" />
              <SkeletonElement customWidth="40%" customHeight="0.875rem" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonElement customWidth="100%" customHeight="0.875rem" />
            <SkeletonElement customWidth="80%" customHeight="0.875rem" />
            <SkeletonElement customWidth="60%" customHeight="0.875rem" />
          </div>
        </div>
      );

    case 'table':
      return (
        <div className={`space-y-3 ${className}`}>
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonElement key={index} customHeight="1.5rem" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <SkeletonElement key={colIndex} customHeight="1.25rem" />
              ))}
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className={`space-y-4 ${className}`}>
          <SkeletonElement customWidth="40%" customHeight="1.5rem" />
          <div className="flex items-end space-x-2 h-48">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonElement
                key={index}
                customWidth="100%"
                customHeight={`${Math.random() * 80 + 20}%`}
                customClass="flex-1"
              />
            ))}
          </div>
        </div>
      );

    default:
      return <SkeletonElement />;
  }
}

// Specialized skeleton components
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <EnhancedSkeletonLoader variant="text" width="200px" height="2rem" />
          <EnhancedSkeletonLoader variant="text" width="300px" height="1rem" />
        </div>
        <EnhancedSkeletonLoader variant="rectangular" width="120px" height="44px" />
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-secondary-800 p-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center justify-between mb-4">
              <EnhancedSkeletonLoader variant="circular" width="48px" height="48px" />
              <EnhancedSkeletonLoader variant="text" width="60px" height="2rem" />
            </div>
            <EnhancedSkeletonLoader variant="text" width="80px" height="1rem" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <EnhancedSkeletonLoader variant="table" rows={5} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <EnhancedSkeletonLoader variant="circular" width="120px" height="120px" />
        <div className="space-y-3 flex-1">
          <EnhancedSkeletonLoader variant="text" width="200px" height="1.5rem" />
          <EnhancedSkeletonLoader variant="text" width="150px" height="1rem" />
          <EnhancedSkeletonLoader variant="text" width="300px" height="1rem" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <EnhancedSkeletonLoader key={index} variant="card" />
        ))}
      </div>
    </div>
  );
}