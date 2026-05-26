import React from 'react';

export default function SkeletonLoader({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="glass p-4 rounded-xl border border-white/20 dark:border-surface-700/30 flex flex-col gap-3 relative overflow-hidden"
        >
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-surface-700/10 animate-shimmer" />

          {/* Top badging / info */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-16 bg-surface-200 dark:bg-surface-800 rounded-md" />
            <div className="h-4 w-10 bg-surface-200 dark:bg-surface-800 rounded" />
          </div>

          {/* Content lines */}
          <div className="space-y-2">
            <div className="h-4 w-5/6 bg-surface-200 dark:bg-surface-800 rounded" />
            <div className="h-3 w-full bg-surface-200 dark:bg-surface-800 rounded" />
          </div>

          {/* Bottom user / email metadata */}
          <div className="flex items-center gap-2 pt-2 border-t border-surface-100 dark:border-surface-700/50">
            <div className="h-3.5 w-3.5 bg-surface-200 dark:bg-surface-800 rounded-full" />
            <div className="h-3 w-32 bg-surface-200 dark:bg-surface-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
