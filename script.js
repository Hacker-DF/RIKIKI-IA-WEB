const API_KEY = "AIzaSyDSIy5m7mTXlMMR_OOdCu2Af_EwoCd124w";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById("chatBox");

function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  input.value = "";
  getBotResponse(userText);
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = sender === "bot" && text.includes("```")
    ? parseCode(text)
    : text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function parseCode(text) {
  return text.replace(/```(\w+)?([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

async function getBotResponse(prompt) {
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.innerText = "⏳ Réflexion...";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Aucune réponse.";
    thinking.remove();
    addMessage("bot", aiText);
  } catch (err) {
    thinking.remove();
    addMessage("bot", "⚠️ Erreur de connexion.");
    console.error(err);
  }
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "fr-FR";
  recognition.start();
  recognition.onresult = (event) => {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };
  recognition.onerror = (event) => {
    alert("Erreur vocale : " + event.error);
  };
}

function downloadChat() {
  const messages = document.querySelectorAll(".message");
  let chatContent = "";
  messages.forEach(msg => {
    chatContent += msg.textContent + "\n";
  });

  const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "conversation_chatbot.txt");
}

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

