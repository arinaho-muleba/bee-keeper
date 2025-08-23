document.getElementById("summarise").addEventListener("click", async () => {
  sendMessageToContent("summarise");
});

document.getElementById("quiz").addEventListener("click", async () => {
  sendMessageToContent("quiz");
});

document.getElementById("flashcards").addEventListener("click", async () => {
  sendMessageToContent("flashcards");
});

function sendMessageToContent(action) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (act) => {
        window.postMessage({ type: "WORKER_BEE_ACTION", action: act }, "*");
      },
      args: [action]
    });
  });
}
