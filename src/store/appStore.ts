import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Location, CheckIn, Notification } from '../types';
import { mockLocations, generateNotifications } from '../data/mockData';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  locations: Location[];
  checkIns: CheckIn[];
  notifications: Notification[];
  unreadCount: number;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkIn: (locationId: string) => Promise<{ success: boolean; message: string }>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  refreshLocations: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      locations: mockLocations,
      checkIns: [],
      notifications: generateNotifications(),
      unreadCount: 3,

      login: async (email: string, password: string) => {
        await new Promise(r => setTimeout(r, 800));
        if (email && password.length >= 6) {
          const user: User = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (name: string, email: string, password: string) => {
        await new Promise(r => setTimeout(r, 1000));
        if (name && email && password.length >= 6) {
          const user: User = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            name,
            email,
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, checkIns: [] });
      },

      checkIn: async (locationId: string) => {
        const { user, checkIns, locations } = get();
        if (!user) return { success: false, message: 'Please login first.' };

        const recent = checkIns.find(
          c => c.locationId === locationId &&
            Date.now() - new Date(c.timestamp).getTime() < 30 * 60 * 1000
        );
        if (recent) return { success: false, message: 'You already checked in here recently.' };

        const location = locations.find(l => l.id === locationId);
        if (!location) return { success: false, message: 'Location not found.' };

        const newCheckIn: CheckIn = {
          id: 'ci_' + Math.random().toString(36).substr(2, 9),
          userId: user.id,
          locationId,
          locationName: location.name,
          timestamp: new Date().toISOString(),
          crowdLevelAtTime: location.crowdLevel,
        };

        const updatedLocations = locations.map(l =>
          l.id === locationId
            ? { ...l, currentCount: Math.min(l.currentCount + 1, l.capacity) }
            : l
        );

        const newNotification: Notification = {
          id: 'notif_' + Math.random().toString(36).substr(2, 9),
          type: 'success',
          title: 'Check-in Confirmed',
          message: `You checked in at ${location.name}. Current crowd: ${location.crowdLevel}.`,
          timestamp: new Date().toISOString(),
          read: false,
          locationId,
        };

        set(state => ({
          checkIns: [newCheckIn, ...state.checkIns],
          locations: updatedLocations,
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        return { success: true, message: `Checked in at ${location.name}!` };
      },

      markNotificationRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      refreshLocations: () => {
        set(state => ({
          locations: state.locations.map(l => ({
            ...l,
            currentCount: Math.max(0, l.currentCount + Math.floor(Math.random() * 10) - 5),
            crowdLevel: l.currentCount / l.capacity < 0.4 ? 'low' : l.currentCount / l.capacity < 0.7 ? 'medium' : 'high',
          })),
        }));
      },
    }),
    {
      name: 'crowd-monitor-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        checkIns: state.checkIns,
      }),
    }
  )
);