importScripts('./ngsw-worker.js');
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log(event);
  if (event.action !== 'goToAlarm' && event.action !== 'deactivate') {
    return;
  }
  let url;
  if (event.action === 'goToAlarm') {
    url = event.notification.data.alarmUrl;
  }
  if (event.action === 'deactivate') {
    url = event.notification.data.deactivationUrl;
  }
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === url ? (windowClient.focus(), true) : false
      );
      if (!hadWindowToFocus)
        clients.openWindow(url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
