"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'success' | 'error' | 'info' | 'push';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto premium-card !p-0 overflow-hidden shadow-2xl border-l-4",
                n.type === 'success' ? "border-l-emerald-500" : 
                n.type === 'error' ? "border-l-rose-500" : 
                n.type === 'push' ? "border-l-amber-500" : "border-l-indigo-500"
              )}
            >
              <div className="flex p-5 gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  n.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : 
                  n.type === 'error' ? "bg-rose-500/10 text-rose-500" : 
                  n.type === 'push' ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-500"
                )}>
                  {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {n.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {n.type === 'push' && <Bell className="w-5 h-5" />}
                  {n.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1 pr-6">
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{n.message}</p>
                </div>
                <button 
                   onClick={() => remove(n.id)}
                   className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                   <X className="w-4 h-4" />
                </button>
              </div>
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className={cn(
                  "h-1 opacity-20",
                  n.type === 'success' ? "bg-emerald-500" : 
                  n.type === 'error' ? "bg-rose-500" : 
                  n.type === 'push' ? "bg-amber-500" : "bg-indigo-500"
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
