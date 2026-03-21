import { useEffect, useState } from 'react';
import { useNotificationStore, registerPeriodicSync, unregisterPeriodicSync, updateServiceWorkerPrefs, checkPeriodicSyncStatus, initializeNotifications } from './notification-prefs.store';

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`;
}

function showNotificationNow(title: string, body: string): void {
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: '/favicon/maskable-icon.png',
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

interface SyncStatus {
  registered: boolean;
  permission: string;
  apiAvailable: boolean;
}

export function NotificationToggle() {
  let { prefs, isSupported, permission, checkSupport, requestPermission, setEnabled, setTime } = useNotificationStore();
  let [isLoading, setIsLoading] = useState(false);
  let [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  let [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    checkSupport();
    initializeNotifications();
  }, [checkSupport]);

  useEffect(() => {
    if (isSupported && prefs.enabled) {
      checkPeriodicSyncStatus().then(setSyncStatus);
    } else {
      setSyncStatus(null);
    }
  }, [isSupported, prefs.enabled]);

  let handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let shouldEnable = e.target.checked;
    setIsLoading(true);

    try {
      if (shouldEnable) {
        let success = await requestPermission();

        setEnabled(true);
        await updateServiceWorkerPrefs();

        if (success) {
          const result = await registerPeriodicSync();
          console.log('[Notification] Periodic sync registration result:', result);
          
          const status = await checkPeriodicSyncStatus();
          setSyncStatus(status);

          new Notification('Notifications Enabled', {
            body: 'You will receive daily reminders to track your habits.',
            icon: '/favicon/maskable-icon.png',
          });
        }

        if (!success && e.target) {
          e.target.checked = false;
        }
      } else {
        setEnabled(false);
        setTime(20, 0);
        setSyncStatus(null);
        await unregisterPeriodicSync();
      }
    } finally {
      setIsLoading(false);
    }
  };

  let handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hour, minute] = e.target.value.split(':').map(Number);
    setTime(hour, minute);
    await updateServiceWorkerPrefs();
  };

  let handleRefreshSync = async () => {
    const result = await registerPeriodicSync();
    console.log('[Notification] Manual sync registration:', result);
    const status = await checkPeriodicSyncStatus();
    setSyncStatus(status);
  };

  if (!isSupported) {
    return (
      <div className='space-y-4 p-4 border rounded-lg'>
        <h3 className='font-bold text-lg'>Notification Settings</h3>
        <p className='text-red-500'>Your browser doesn't support notifications</p>
      </div>
    );
  }

  const syncActive = syncStatus?.registered && syncStatus?.permission === 'granted';

  return (
    <div className='space-y-4 p-4 border rounded-lg'>
      <h3 className='font-bold text-lg'>Notification Settings</h3>

      <div className='flex items-center gap-4'>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='sr-only peer'
            checked={prefs.enabled}
            onChange={handleToggle}
            disabled={isLoading || permission === 'denied'}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className='ml-3 text-lg font-medium'>
            {prefs.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {permission === 'denied' && (
        <p className='text-sm text-red-500'>
          You've blocked notifications at browser level. Please reset in browser settings.
        </p>
      )}

      {prefs.enabled && (
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <label htmlFor='reminder-time' className='text-sm font-medium'>Daily reminder time:</label>
            <input
              id='reminder-time'
              type='time'
              value={`${prefs.hour.toString().padStart(2, '0')}:${prefs.minute.toString().padStart(2, '0')}`}
              onChange={handleTimeChange}
              className='px-3 py-1.5 border rounded-md'
            />
          </div>

          <p className='text-xs text-gray-500'>
            Current: {formatTime(prefs.hour, prefs.minute)}
          </p>

          {syncActive && (
            <p className='text-xs text-green-600'>
              Background sync active - you'll receive notifications even when the app is closed.
            </p>
          )}

          {!syncActive && prefs.enabled && permission === 'granted' && (
            <div className='space-y-1'>
              <p className='text-xs text-amber-600'>
                Background sync not active. This may be because:
              </p>
              <ul className='text-xs text-amber-600 list-disc list-inside'>
                {!syncStatus?.apiAvailable && <li>Browser doesn't support Periodic Background Sync</li>}
                {syncStatus?.permission === 'denied' && <li>Background sync permission was denied</li>}
                {syncStatus?.permission === 'prompt' && <li>Background sync permission needs to be granted</li>}
                {!syncStatus?.registered && syncStatus?.apiAvailable && <li>Sync not registered - tap refresh below</li>}
              </ul>
              <button
                type='button'
                onClick={handleRefreshSync}
                className='mt-2 px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs hover:bg-amber-200'
              >
                Refresh Background Sync
              </button>
            </div>
          )}

          {prefs.enabled && permission === 'granted' && (
            <button
              type='button'
              onClick={() => showNotificationNow('Time to track your habits!', "Don't forget to log your daily habits.")}
              className='mt-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition'
            >
              Test Reminder Now
            </button>
          )}

          <button
            type='button'
            onClick={() => setShowDebug(!showDebug)}
            className='text-xs text-gray-400 hover:text-gray-600'
          >
            {showDebug ? 'Hide' : 'Show'} debug info
          </button>

          {showDebug && syncStatus && (
            <pre className='text-xs bg-gray-100 p-2 rounded overflow-auto'>
              {JSON.stringify(syncStatus, null, 2)}
            </pre>
          )}
        </div>
      )}

      {isLoading && (
        <p className='text-sm text-gray-500'>Updating notification settings...</p>
      )}
    </div>
  );
}