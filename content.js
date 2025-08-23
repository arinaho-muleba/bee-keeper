window.addEventListener("message", async (event) => {
  if (event.data.type === "WORKER_BEE_ACTION") {
    const action = event.data.action;

    // Grab visible text on the page
    let sectionText = document.body.innerText;

    let prompt = "";
    if (action === "summarise") {
      prompt = `Summarise this learning content:\n\n${sectionText}`;
    } else if (action === "quiz") {
      prompt = `Create 5 multiple choice questions with answers from this content:\n\n${sectionText}`;
    } else if (action === "flashcards") {
      prompt = `Generate 10 flashcards (front: question, back: answer) from this:\n\n${sectionText}`;
    }

    // Call AI API (Gemini as example)
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": "YOUR_API_KEY_HERE"
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    alert(output); // Quick test – later replace with nicer UI
  }
});
