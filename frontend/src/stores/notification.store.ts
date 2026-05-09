import { create } from 'zustand';
import { generateId } from '../utils/format';

export type NotifType = 'approved' | 'rejected' | 'buy' | 'sell' | 'deposit' | 'withdraw' | 'info';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  push: (n: Pick<Notification, 'type' | 'title' | 'message'>) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  get unreadCount() {
    return get().notifications.filter(n => !n.read).length;
  },

  push: (n) => {
    const notif: Notification = {
      id: generateId(),
      type: n.type,
      title: n.title,
      message: n.message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set(s => ({ notifications: [notif, ...s.notifications].slice(0, 50) }));
  },

  markAllRead: () => {
    set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
  },

  dismiss: (id) => {
    set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
  },
}));
