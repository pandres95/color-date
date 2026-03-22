const CACHE_NAME = 'colour-date-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // Cache the start_url for offline installability test
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html', '/manifest.json', '/favicon.svg']);
    }).catch(err => console.error('Cache install failed:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Handle native Android share target
  if (event.request.url.includes('/share-target') && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const images = formData.getAll('images');
          
          if (images.length > 0) {
            await saveImagesToIndexedDB(images);
          }
          
          // Redirect the user to the SPA crop/adjust builder route
          return Response.redirect('/?shared=true', 303);
        } catch (error) {
          console.error('Error handling share target:', error);
          return Response.redirect('/?error=share_failed', 303);
        }
      })()
    );
    return;
  }

  // Basic offline strategy to satisfy Android PWA installation criteria
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        // If it's a navigation request and we're offline, return index.html
        if (event.request.mode === 'navigate') {
          return cache.match('/index.html');
        }
        
        return undefined;
      })
    );
  }
});

function saveImagesToIndexedDB(files) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ColourDate_IDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('shared-images')) {
        db.createObjectStore('shared-images', { autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('shared-images', 'readwrite');
      const store = transaction.objectStore('shared-images');
      
      // Clear previous session images before adding new ones
      store.clear();
      
      let pending = files.length;
      if (pending === 0) resolve();

      files.forEach((file) => {
        const req = store.add(file);
        req.onsuccess = () => {
          pending--;
          if (pending === 0) resolve();
        };
        req.onerror = () => reject(req.error);
      });
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
