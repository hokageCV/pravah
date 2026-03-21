import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationPrefs {
  enabled: boolean;
  hour: number;
  minute: number;
}

interface NotificationStore {
  prefs: NotificationPrefs;
  isSupported: boolean;
  permission: NotificationPermission;
  setEnabled: (enabled: boolean) => void;
  setTime: (hour: number, minute: number) => void;
  checkSupport: () => void;
  requestPermission: () => Promise<boolean>;
}

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: true,
  hour: 20,
  minute: 0,
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      prefs: DEFAULT_PREFS,
      isSupported: false,
      permission: 'default',

      checkSupport: () => {
        const supported = 'Notification' in window && 'serviceWorker' in navigator;
        set({ isSupported: supported });
        if (supported) {
          set({ permission: Notification.permission });
        }
      },

      setEnabled: (enabled) => {
        set((state) => ({ prefs: { ...state.prefs, enabled } }));
      },

      setTime: (hour, minute) => {
        set((state) => ({ prefs: { ...state.prefs, hour, minute } }));
      },

      requestPermission: async () => {
        if (!get().isSupported) return false;
        
        try {
          const result = await Notification.requestPermission();
          set({ permission: result });
          return result === 'granted';
        } catch (error) {
          console.error('Failed to request notification permission:', error);
          return false;
        }
      },
    }),
    {
      name: 'notification-prefs',
    }
  )
);

export async function registerPeriodicSync(): Promise<{ success: boolean; reason?: string }> {
  if (!('serviceWorker' in navigator)) {
    return { success: false, reason: 'Service Worker not supported' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const periodicSync = (registration as ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, options?: { minInterval: number }) => Promise<void>; unregister: (tag: string) => Promise<void>; getTags: () => Promise<string[]> } }).periodicSync;
    
    if (!periodicSync) {
      console.log('[Notification] Periodic Background Sync API not available');
      return { success: false, reason: 'API not available' };
    }

    try {
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
      console.log('[Notification] Periodic sync permission state:', status.state);
      
      if (status.state === 'granted') {
        await periodicSync.register('habit-reminder', {
          minInterval: 60 * 60 * 1000, // 1 hour minimum (Chrome requirement)
        });
        console.log('[Notification] Periodic sync registered successfully');
        return { success: true };
      } else if (status.state === 'prompt') {
        // Try to register anyway - browser may prompt user
        await periodicSync.register('habit-reminder', {
          minInterval: 60 * 60 * 1000,
        });
        console.log('[Notification] Periodic sync registered (prompt state)');
        return { success: true };
      } else {
        return { success: false, reason: 'Permission denied' };
      }
    } catch (permError) {
      // Permission query might fail on some browsers, try registering anyway
      console.log('[Notification] Permission query failed, trying direct registration:', permError);
      await periodicSync.register('habit-reminder', {
        minInterval: 60 * 60 * 1000,
      });
      return { success: true };
    }
  } catch (error) {
    console.error('[Notification] Failed to register periodic sync:', error);
    return { success: false, reason: String(error) };
  }
}

export async function unregisterPeriodicSync(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const periodicSync = (registration as ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, options?: { minInterval: number }) => Promise<void>; unregister: (tag: string) => Promise<void>; getTags: () => Promise<string[]> } }).periodicSync;
    
    if (periodicSync) {
      await periodicSync.unregister('habit-reminder');
    }
  } catch (error) {
    console.error('Failed to unregister periodic sync:', error);
  }
}

export async function updateServiceWorkerPrefs(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Send message to service worker to update prefs
    const prefs = useNotificationStore.getState().prefs;
    registration.active?.postMessage({
      type: 'UPDATE_PREFS',
      payload: prefs,
    });
  } catch (error) {
    console.error('Failed to update service worker prefs:', error);
  }
}

export async function checkPeriodicSyncStatus(): Promise<{ registered: boolean; permission: string; apiAvailable: boolean }> {
  const result = {
    registered: false,
    permission: 'unknown',
    apiAvailable: false,
  };

  if (!('serviceWorker' in navigator)) {
    return result;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const periodicSync = (registration as ServiceWorkerRegistration & { periodicSync?: { register: (tag: string, options?: { minInterval: number }) => Promise<void>; unregister: (tag: string) => Promise<void>; getTags: () => Promise<string[]> } }).periodicSync;
    
    result.apiAvailable = !!periodicSync;

    if (periodicSync) {
      const tags = await periodicSync.getTags();
      result.registered = tags.includes('habit-reminder');
    }

    try {
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
      result.permission = status.state;
    } catch {
      result.permission = 'unavailable';
    }
  } catch (error) {
    console.error('Failed to check periodic sync status:', error);
  }

  return result;
}

export async function initializeNotifications(): Promise<void> {
  const prefs = useNotificationStore.getState().prefs;
  
  if (!prefs.enabled) return;
  
  if (Notification.permission === 'granted') {
    await updateServiceWorkerPrefs();
    await registerPeriodicSync();
  }
}