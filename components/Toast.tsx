/**
 * NOVA STUDIO - Toast 通知系统
 *
 * 替代原生的 alert()，提供更好的用户体验
 */

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isProgressing, setIsProgressing] = useState(true);

  useEffect(() => {
    // 进入动画
    requestAnimationFrame(() => setIsVisible(true));

    // 自动关闭
    const timer = setTimeout(() => {
      setIsProgressing(false);
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg
        transition-all duration-300 ease-out
        ${bgColors[type]}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsProgressing(false);
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 text-zinc-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

let toastId = 0;
const listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

// Toast 管理器
export const toast = {
  success: (message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    toasts.push({ id, type: 'success', message, duration });
    listeners.forEach(l => l([...toasts]));
    return id;
  },
  error: (message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    toasts.push({ id, type: 'error', message, duration: duration || 5000 }); // 错误消息显示更久
    listeners.forEach(l => l([...toasts]));
    return id;
  },
  info: (message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    toasts.push({ id, type: 'info', message, duration });
    listeners.forEach(l => l([...toasts]));
    return id;
  },
  warning: (message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    toasts.push({ id, type: 'warning', message, duration });
    listeners.forEach(l => l([...toasts]));
    return id;
  },
  remove: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(l => l([...toasts]));
  },
};

/**
 * Toast 容器组件
 * 放在 App.tsx 的最外层
 */
export const ToastContainer: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToastList(newToasts);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toastList.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onClose={toast.remove} />
        </div>
      ))}
    </div>
  );
};
