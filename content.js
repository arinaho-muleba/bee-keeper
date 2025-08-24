document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("deviceId", (data) => {
    if (data.deviceId) {
      console.log("Device ID:", data.deviceId);
      const el = document.getElementById("deviceIdDisplay");
      if (el) {
        el.textContent = data.deviceId;
      }
    } else {
      console.log("No device ID found yet");
    }
  });
});

window.addEventListener("message", async (event) => {
  console.log("Received message in content script:", event.data);

  if (event.data.type === "WORKER_BEE_ACTION") {
    const action = event.data.action;

    // Traverse nested shadow DOMs
    let sectionText = "No content found";
    try {
      const theHive = document.querySelector("body > the-hive")?.shadowRoot;
      const mainSection = theHive?.querySelector("main > e-section")?.shadowRoot;
      const contentSection = mainSection?.querySelector("section > e-content")?.shadowRoot;
      const divElement = contentSection?.querySelector("div");

      if (divElement) {
        sectionText = divElement.innerText;
      }
    } catch (err) {
      console.error("Error accessing nested shadow DOM:", err);
    }

    // Decide API type
    let apiType;
    switch (action) {
      case "summarise":
        apiType = "summary";
        break;
      case "quiz":
        apiType = "quiz";
        break;
      case "flashcards":
        apiType = "flashcards";
        break;
      default:
        alert("Unknown action type");
        return;
    }

    // ✅ Get deviceId before calling API
    chrome.storage.local.get("deviceId", async (data) => {
      if (!data.deviceId) {
        alert("No device ID found yet.");
        return;
      }

      try {
        const response = await fetch(
          //"http://127.0.0.1:5001/bee-keeper-57fbe/us-central1/generate",
          "https://us-central1-bee-keeper-57fbe.cloudfunctions.net/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: apiType,
              content: sectionText,
              uid: data.deviceId, // ✅ use stored device ID
            }),
          }
        );

        const result = await response.json();
        console.log("API response:", result);

        if (result.link) {
          window.open(result.link, "_blank");
        } else {
          alert("Something went wrong. No link returned from API.");
        }
      } catch (err) {
        alert("Error calling API: " + err.message);
      }
    });
  }
});

// Listen for messages from the webpage
window.addEventListener("message", (event) => {
  if (event.source !== window) return; // ignore messages from other sources

  if (event.data && event.data.type === "GET_DEVICE_ID") {
    // Get deviceId from chrome.storage.local
    chrome.storage.local.get("deviceId", (data) => {
      // Send it back to the webpage
      window.postMessage({ type: "DEVICE_ID_RESPONSE", deviceId: data.deviceId }, "*");
    });
  }
});
