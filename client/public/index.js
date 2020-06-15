import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
} from "./chatApi.js";

import messages from "./messages.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");
let timeout;
let typing = false;
let name = window.sessionStorage.getItem("name");

if (!name) {
  name = prompt(messages.promptName);
  name = name ? name : messages.defaultName;
  window.sessionStorage.setItem("name", name);
}

appendMyMessage(messages.youJoined);
emitNewUser(name);
onNewMessage(appendOtherMessage, () => messages.otherMessage(data.name, data.message));
onNewUser(appendOtherMessage, () => messages.otherJoined(name));
onUserDisconnect(appendOtherMessage, () => messages.otherDisconnected(name));
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
  } else {
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
  appendMessage(message, "myMessage");
}

function appendOtherMessage(message) {
  appendMessage(message, "otherMessage");
}

function appendMessage(message, messageClass) {
  const bdi = document.createElement("bdi");
  const messageElement = document.createElement("div");
  messageElement.appendChild(bdi);
  messageElement.classList.add(messageClass);
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
