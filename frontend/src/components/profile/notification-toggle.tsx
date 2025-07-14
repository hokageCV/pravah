import { useState } from 'react';
import { useNotification } from './useNotifications';
import { showTestNotification } from './notification-utils';

export function NotificationToggle() {
  let {
    isSupported,
    permission,
    requestPermission,
    isEnabled,
    isReady,
    isUserDisabled,
  } = useNotification();

  let [isLoading, setIsLoading] = useState(false);

  if (!isReady) {
    return <div className='animate-pulse h-6 w-24 bg-gray-200 rounded'></div>;
  }

  let handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let shouldEnable = e.target.checked;
    setIsLoading(true);

    try {
      let success = await requestPermission(shouldEnable);

      if (shouldEnable && !success) {
        e.target.checked = false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className='space-y-4 p-4 border rounded-lg'>
        <h3 className='font-bold text-lg'>Notification Settings</h3>
        <p className='text-red-500'>
          Your browser doesn't support notifications
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4 p-4 border rounded-lg'>
      <h3 className='font-bold text-lg'>Notification Settings</h3>

      <div className='flex items-center gap-4'>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='sr-only peer'
            checked={isEnabled}
            onChange={handleToggle}
            disabled={isLoading || permission === 'denied'}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className='ml-3 text-lg font-medium'>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {permission === 'denied' && !isUserDisabled && (
        <p className='text-sm text-red-500'>
          You've blocked notifications at browser level. Please reset in browser
          settings.
        </p>
      )}

      {isUserDisabled && (
        <p className='text-sm text-blue-500'>
          Notifications are disabled in app settings. Enable to receive
          notifications.
        </p>
      )}

      {isEnabled && !isLoading && (
        <button
          onClick={() => showTestNotification('Test Notification')}
          className='mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition'
        >
          Test Notification
        </button>
      )}

      {isLoading && (
        <p className='text-sm text-gray-500'>
          Updating notification settings...
        </p>
      )}
    </div>
  );
}
