export async function getOrCreateDeviceId() {
  return new Promise((resolve) => {
    chrome.storage.local.get("deviceId", (data) => {
      if (data.deviceId) {
        resolve(data.deviceId);
      } else {
        const newId = crypto.randomUUID();
        chrome.storage.local.set({ deviceId: newId }, () => {
          resolve(newId);
        });
      }
    });
  });
}
