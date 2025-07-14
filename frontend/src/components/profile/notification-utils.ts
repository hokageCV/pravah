export function checkBrowserNotificationSupport(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await Notification.requestPermission();
}

export function showTestNotification(title: string): void {
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body: 'Notification enabled for Pravah.',
      icon: '/favicon/maskable-icon.png',
    });
  } catch (error) {
    console.error('Failed to show test notification:', error);
  }
}
