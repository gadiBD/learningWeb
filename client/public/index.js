import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
} from "./socketApi.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");
let timeout;
let typing = false;

const name = prompt("What is your name?");
appendMessage("You joined", true);
emitNewUser(name);

onNewMessage(appendMessage);
onNewUser(appendMessage);
onUserDisconnect(appendMessage);
onTyping(showTypingMessage);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, true);
  emitNewMessage(message);
  messageInput.value = "";
});

messageInput.addEventListener("keyup", (e) => {
  if (e.key !== "Enter") {
    typing = true;
    emitTyping({ user: name, typing: typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 3000);
  } else {
    clearTimeout(timeout);
    typingTimeout();
  }
});

function appendMessage(message, myMessage) {
  const bdi = document.createElement("bdi");
  const messageElement = document.createElement("div");
  messageElement.appendChild(bdi);
  messageElement.setAttribute("class", myMessage ? "myMessage" : "otherMessage");
  bdi.innerText = message;
  messageContainer.append(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
}

function typingTimeout() {
  typing = false;
  emitTyping({ user: name, typing: typing });
}

function showTypingMessage(data) {
  if (data.typing) {
    typingInfo.innerHTML = `${data.user} is typing...`;
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerHTML = "";
    typingInfo.style.display = "none";
  }
}
