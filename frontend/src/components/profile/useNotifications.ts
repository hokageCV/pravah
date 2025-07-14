import { useEffect, useState } from 'react';

export function useNotification() {
  let [permission, setPermission] = useState<NotificationPermission>('default');
  let [isSupported, setIsSupported] = useState(false);
  let [isReady, setIsReady] = useState(false);
  let [userDisabled, setUserDisabled] = useState(false);

  useEffect(() => {
    let supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) setPermission(Notification.permission);
    setIsReady(true);
  }, []);

  let requestPermission = async (enable: boolean): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      if (enable) {
        let result = await Notification.requestPermission();
        setPermission(result);
        setUserDisabled(false);

        return result === 'granted';
      } else {
        setUserDisabled(true);
        return false;
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    isEnabled: permission === 'granted' && !userDisabled,
    isReady,
    isUserDisabled: userDisabled,
  };
}
