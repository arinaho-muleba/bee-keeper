chrome.runtime.onInstalled.addListener(() => {
  console.log("Worker-Bee installed!");
  // write a random device ID to local storage if it doesn't exist
    chrome.storage.local.get("deviceId", (data) => {
      if (!data.deviceId) {
        const newId = crypto.randomUUID();
        chrome.storage.local.set({ deviceId: newId }, () => {
          console.log("New device ID created:", newId);
        });
      }
    }
    );
});

