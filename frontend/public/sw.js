const _CACHE_NAME = 'pravah-notification-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'habit-reminder') {
    event.waitUntil(sendReminderNotification());
  }
});

async function sendReminderNotification() {
  const permission = await self.Notification.permission;
  if (permission !== 'granted') return;

  try {
    const sync = await navigator.storage.getDirectory();
    
    let reminderHour = 20;
    let reminderMinute = 0;
    let enabled = true;

    try {
      const fileHandle = await sync.getFileHandle('notification-prefs.json');
      const file = await fileHandle.getFile();
      const text = await file.text();
      const prefs = JSON.parse(text);
      reminderHour = prefs.hour ?? 20;
      reminderMinute = prefs.minute ?? 0;
      enabled = prefs.enabled ?? true;
    } catch {
      // Use defaults
    }

    if (!enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const timeDiff = Math.abs((currentHour * 60 + currentMinute) - (reminderHour * 60 + reminderMinute));
    
    if (timeDiff > 15) return;

    await self.registration.showNotification('Time to track your habits!', {
      body: "Don't forget to log your daily habits.",
      icon: '/favicon/maskable-icon.png',
      badge: '/favicon/favicon-32x32.png',
      tag: 'habit-reminder',
      renotify: true,
      data: { url: '/' }
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});

self.addEventListener('message', async (event) => {
  if (event.data?.type === 'UPDATE_PREFS') {
    try {
      const sync = await navigator.storage.getDirectory();
      const fileHandle = await sync.getFileHandle('notification-prefs.json', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(event.data.payload));
      await writable.close();
    } catch (error) {
      console.error('Failed to save prefs:', error);
    }
  }
});