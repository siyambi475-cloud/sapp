// ফায়ারবেস সার্ভিস ওয়ার্কার স্ক্রিপ্ট ইমপোর্ট করা হচ্ছে
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBiVxBxExXHd2OqWa5LqZNE5a2t-6j1n9Y",
  authDomain: "sapp-38df8.firebaseapp.com",
  databaseURL: "https://sapp-38df8-default-rtdb.firebaseio.com",
  projectId: "sapp-38df8",
  storageBucket: "sapp-38df8.firebasestorage.app",
  messagingSenderId: "335406842966",
  appId: "1:335406842966:web:1cccf3395fb3e11460a7f7"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ব্যাকগ্রাউন্ড নোটিফিকেশন হ্যান্ডলার (যখন অ্যাপ বন্ধ থাকবে)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://via.placeholder.com/100', // নোটিফিকেশনের ছোট লোগো
    badge: payload.notification.icon || 'https://via.placeholder.com/100',
    data: { url: payload.data?.url || '/' } // ক্লিক করলে যেখানে যাবে
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// নোটিফিকেশনে ক্লিক করলে অ্যাপ ওপেন হওয়ার লজিক
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
