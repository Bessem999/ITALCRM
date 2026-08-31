import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Calendar, 
  Car,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export type SnackBarType = 'success' | 'rejection' | 'warning' | 'info';

export interface SnackBarNotification {
  id: string;
  type: SnackBarType;
  title: string;
  message: string;
  details?: string;
  badge?: string;
  duration?: number; // ms, default 5000
  actionLabel?: string;
  onAction?: () => void;
}

interface SnackBarProps {
  notifications: SnackBarNotification[];
  onDismiss: (id: string) => void;
}

export const SnackBar: React.FC<SnackBarProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <aside
      aria-label="Notifications et alertes système"
      aria-live="polite"
      className="fixed bottom-5 right-4 sm:right-6 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100%-2rem)] pointer-events-none"
    >
      {notifications.map((n) => (
        <SnackBarCard key={n.id} notification={n} onDismiss={() => onDismiss(n.id)} />
      ))}
    </aside>
  );
};

interface SnackBarCardProps {
  notification: SnackBarNotification;
  onDismiss: () => void;
}

const SnackBarCard: React.FC<SnackBarCardProps> = ({ notification, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  const config = {
    success: {
      bg: 'bg-slate-900 dark:bg-slate-950 text-white border-emerald-500/80 shadow-emerald-950/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      progressBar: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      defaultBadge: 'Confirmé / Succès',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    rejection: {
      bg: 'bg-slate-900 dark:bg-slate-950 text-white border-red-500/80 shadow-red-950/40',
      iconBg: 'bg-red-500/20 text-red-400 border border-red-500/30',
      progressBar: 'bg-red-500',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      defaultBadge: 'Demande Rejetée',
      icon: <XCircle className="w-5 h-5" />,
    },
    warning: {
      bg: 'bg-slate-900 dark:bg-slate-950 text-white border-amber-500/80 shadow-amber-950/40',
      iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      progressBar: 'bg-amber-500',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      defaultBadge: 'Attention',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      bg: 'bg-slate-900 dark:bg-slate-950 text-white border-sky-500/80 shadow-sky-950/40',
      iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
      progressBar: 'bg-sky-500',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      defaultBadge: 'Information',
      icon: <Info className="w-5 h-5" />,
    },
  }[notification.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border-2 shadow-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={`p-2 rounded-xl shrink-0 ${config.iconBg}`}>
          {config.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="text-sm font-extrabold text-white tracking-tight">
              {notification.title}
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badgeBg}`}
            >
              {notification.badge || config.defaultBadge}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {notification.message}
          </p>

          {notification.details && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">{notification.details}</span>
            </div>
          )}

          {notification.actionLabel && notification.onAction && (
            <button
              type="button"
              onClick={() => {
                notification.onAction?.();
                onDismiss();
              }}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <span>{notification.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
