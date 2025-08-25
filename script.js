const API_KEY = "YOUR_API_KEY_HERE"; // Remplace par ta vraie clé Gemini
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  input.value = "";
  getBotResponse(userText);
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  if (sender === "bot" && text.includes("```")) {
    msg.innerHTML = parseCode(text);
  } else {
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function parseCode(text) {
  return text.replace(/```(\w+)?([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });
}

function escapeHtml(str) {
  return str
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");
}

async function getBotResponse(prompt) {
  const loading = document.createElement("div");
  loading.className = "message bot";
  loading.textContent = "⏳ Typing...";
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt}]}]})
});

    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response.";
    loading.remove();
    addMessage("bot", aiText);
} catch (err) {
    loading.remove();
    addMessage("bot", "⚠ Error getting response.");
    console.error("API error:", err);
}
}

// 🎤 Voice input
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
}

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    input.focus();
};

  recognition.onerror = (event) => {
    console.error("Voice input error:", event.error);
    alert("Voice input error: " + event.error);
};
}

// 🔗 Copy site link
function copySiteLink() {
  const siteURL = "https://hacker-df.github.io/RIKIKI-IA-WEB/";
  navigator.clipboard.writeText(siteURL)
.then(() => alert("✅ Site link copied to clipboard!"))
.catch(() => alert("❌ Failed to copy link."));
}