import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppStore } from '../store/appStore';
import type { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  index?: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, index = 0 }) => {
  const { markNotificationRead } = useAppStore();

  const config = {
    alert: { icon: AlertTriangle, bg: 'bg-red-500/10', icon_color: 'text-red-400', border: 'border-red-500/20' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', icon_color: 'text-amber-400', border: 'border-amber-500/20' },
    info: { icon: Info, bg: 'bg-blue-500/10', icon_color: 'text-blue-400', border: 'border-blue-500/20' },
    success: { icon: CheckCircle, bg: 'bg-emerald-500/10', icon_color: 'text-emerald-400', border: 'border-emerald-500/20' },
  };

  const { icon: Icon, bg, icon_color, border } = config[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      onClick={() => !notification.read && markNotificationRead(notification.id)}
      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        notification.read
          ? 'bg-slate-800/30 border-slate-700/30 opacity-60'
          : `${bg} ${border} hover:opacity-90`
      }`}
    >
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${icon_color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${notification.read ? 'text-slate-400' : 'text-white'}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notification.message}</p>
        <p className="text-[10px] text-slate-500 mt-1.5">
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationItem;