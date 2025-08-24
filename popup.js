const showLoader = (loaderText) => {
  document.getElementById("buttons").classList.add("hidden");
  document.getElementById("loaderContainer").classList.remove("hidden");
  document.getElementById("loaderText").innerText =  loaderText;
};

const showWrongSiteWarning = () => {
  document.getElementById("buttons").classList.add("hidden");
  document.getElementById("wrongSite").classList.remove("hidden");
};

document.getElementById("close-btn").addEventListener("click", () => {
  window.close();
});

document.getElementById("summarise").addEventListener("click", async () => {
  sendMessageToContent("summarise");
    showLoader("Busy generating your summary...");
});

document.getElementById("quiz").addEventListener("click", async () => {
  sendMessageToContent("quiz", document.getElementById("difficulty").value);
    showLoader("Busy generating your quiz...");
});

function sendMessageToContent(action,difficulty) {
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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url || "";
  // Replace with the exact domain or part of URL you want to allow
  if (!url.includes("the-hive.bbd.co.za/course")) {
    showWrongSiteWarning();
  }
});