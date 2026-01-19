/**
 * NOVA STUDIO - 优化的加载状态组件
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  progress?: number; // 0-100
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  progress,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-violet-500`}
        />
        {progress !== undefined && (
          <svg
            className={`absolute top-0 left-0 ${sizeClasses[size]} -rotate-90`}
          >
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-violet-500/20"
            />
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="text-violet-500"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      {text && (
        <div className="flex flex-col items-center gap-1">
          <p className={`${textSizeClasses[size]} text-zinc-400 font-medium`}>
            {text}
          </p>
          {progress !== undefined && (
            <p className="text-xs text-zinc-500">{Math.round(progress)}%</p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="p-8 rounded-2xl bg-[#0a0a0f]/90 border border-white/10 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return <div className="p-4">{content}</div>;
};

/**
 * 节点加载状态组件
 */
export const NodeLoadingState: React.FC<{
  status: string;
  progress?: number;
}> = ({ status, progress }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl z-10">
      <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
      <p className="text-xs text-zinc-400 font-medium">{status}</p>
      {progress !== undefined && (
        <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * 脉冲加载占位符
 */
export const SkeletonPulse: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return <div className={`bg-zinc-800 animate-pulse rounded ${className}`} />;
};
