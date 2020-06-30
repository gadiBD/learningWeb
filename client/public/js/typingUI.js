import messagesFormatter from "./messagesFormatter.js";

const typingInfo = document.getElementById("typing-info");

export function showTypingMessage(data) {
  if (data.typing) {
    typingInfo.innerText = messagesFormatter.isTyping(data.user);
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerText = "";
    typingInfo.style.display = "none";
  }
}
