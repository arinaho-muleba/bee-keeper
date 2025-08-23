window.addEventListener("message", async (event) => {
  console.log("Received message in content script:", event.data);

  if (event.data.type === "WORKER_BEE_ACTION") {
    const action = event.data.action;
    const loadingBee = document.getElementById("loadingBee");
    const contentArea = document.getElementById("contentArea");

    // Show loading
    //loadingBee.classList.remove("hidden");
    //contentArea.innerHTML = "";

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

    // Call your new API
    try {
        let apiType;
        switch(action) {
            case 'summarise':
                apiType = 'summary';
                break;
            case 'quiz':
                apiType = 'quiz';
                break;
            case 'flashcards':
                apiType = 'flashcards';
                break;
            default:
                throw new Error("Unknown action type");
        }
      const response = await fetch("http://127.0.0.1:5001/bee-keeper-57fbe/us-central1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: apiType,       // 'summary', 'quiz', or 'flashcards'
          content: sectionText,
          uid: "some-uid"     // optional, can be null
        })
      });

      const data = await response.json();
      console.log("API response:", data);

      //loadingBee.classList.add("hidden");

      if (data.link) {
        // Open the Firestore content in a new tab
        window.open(data.link, "_blank");
      } else {
        contentArea.innerHTML = `<p class="text-red-500">No link returned from API.</p>`;
      }
    } catch (err) {
      //loadingBee.classList.add("hidden");
      contentArea.innerHTML = `<p class="text-red-500">Error calling API: ${err.message}</p>`;
    }
  }
});
