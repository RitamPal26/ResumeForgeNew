import React from 'react';

export function LoadingSkeleton({ type }) {
  const pulseClass = "animate-pulse bg-secondary-200 rounded";

  switch (type) {
    case 'profile':
      return (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className={`w-32 h-32 rounded-full ${pulseClass}`} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className={`h-8 w-48 ${pulseClass}`} />
              <div className={`h-4 w-32 ${pulseClass}`} />
              <div className={`h-4 w-full max-w-md ${pulseClass}`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-4 w-24 ${pulseClass}`} />
              ))}
            </div>
            <div className="flex space-x-6 pt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className={`h-6 w-12 ${pulseClass}`} />
                  <div className={`h-3 w-16 ${pulseClass}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'repositories':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border border-secondary-200 rounded-lg space-y-3">
              <div className={`h-5 w-3/4 ${pulseClass}`} />
              <div className={`h-4 w-full ${pulseClass}`} />
              <div className={`h-4 w-2/3 ${pulseClass}`} />
              <div className="flex space-x-3">
                <div className={`h-3 w-16 ${pulseClass}`} />
                <div className={`h-3 w-12 ${pulseClass}`} />
                <div className={`h-3 w-12 ${pulseClass}`} />
              </div>
              <div className={`h-3 w-24 ${pulseClass}`} />
            </div>
          ))}
        </div>
      );

    case 'languages':
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${pulseClass}`} />
                  <div className={`h-4 w-20 ${pulseClass}`} />
                </div>
                <div className={`h-4 w-8 ${pulseClass}`} />
              </div>
              <div className={`w-full h-2 rounded-full ${pulseClass}`} />
            </div>
          ))}
        </div>
      );

    case 'activity':
      return (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3">
              <div className={`w-8 h-8 rounded-full ${pulseClass}`} />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`h-4 w-16 ${pulseClass}`} />
                  <div className={`h-4 w-24 ${pulseClass}`} />
                  <div className={`h-4 w-32 ${pulseClass}`} />
                </div>
                <div className={`h-3 w-full max-w-sm ${pulseClass}`} />
                <div className={`h-3 w-20 ${pulseClass}`} />
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-4 w-full ${pulseClass}`} />
          ))}
        </div>
      );
  }
}