import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
} from "./api.js";

import messages from "./messages.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");
let timeout;
let typing = false;
let name;

if (!window.sessionStorage.getItem("name")) {
  name = prompt(messages.promptName);
  name = name ? name : messages.defaultName;
  window.sessionStorage.setItem("name", name);
}

appendMyMessage(messages.youJoined);
emitNewUser(name);

onNewMessage(appendOtherMessage);
onNewUser(appendOtherMessage);
onUserDisconnect(appendOtherMessage);
onTyping(showTypingMessage);

sendButton.addEventListener("click", () => {
  submitMessage();
  clearTimeout(timeout);
  typingTimeout();
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    submitMessage();
    clearTimeout(timeout);
    typingTimeout();
  } else if (e.key !== "Enter") {
    typing = true;
    emitTyping({ user: name, typing: typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 3000);
  }
});

function submitMessage() {
  messageInput.value = messageInput.value.trim();
  if (messageInput.value) {
    const message = messageInput.value;
    appendMyMessage(messages.yourMessage(message));
    emitNewMessage(message);
    messageInput.value = "";
  }
}

function appendMyMessage(message) {
  appendMessage(message, "myMessage")
}

function appendOtherMessage(message) {
  appendMessage(message, "otherMessage")
}

function appendMessage(message, messageClass) {
  const bdi = document.createElement("bdi");
  const messageElement = document.createElement("div");
  messageElement.appendChild(bdi);
  messageElement.setAttribute("class", messageClass);
  bdi.innerText = message;
  messageContainer.append(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
  messageElement.classList.add("horizontalTrasnition");
}

function typingTimeout() {
  typing = false;
  emitTyping({ user: name, typing: typing });
}

function showTypingMessage(data) {
  if (data.typing) {
    typingInfo.innerHTML = messages.isTyping(data.user);
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerHTML = "";
    typingInfo.style.display = "none";
  }
}
