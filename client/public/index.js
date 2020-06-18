import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
  onGeneratedName,
  emitGenerateName,
  onUsernameTaken,
} from "./chatApi.js";

import messages from "./messages.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");

let timeout;
let name = window.sessionStorage.getItem("name");
let finishedTypingTimeout = debounce(typingTimeout, 3000);

onNewMessage(appendOtherMessage, (data) =>
  messages.otherMessage(data.name, data.message)
);
onNewUser(appendOtherMessage, messages.otherJoined);
onUserDisconnect(appendOtherMessage, messages.otherDisconnected);
onTyping(showTypingMessage);
onGeneratedName(onRecievedName);
onUsernameTaken(alert, messages.usernameTaken);

if (!name) {
  name = prompt(messages.promptName);
  if (!name) {
    emitGenerateName();
  } else {
    startSession();
  }
}

sendButton.addEventListener("click", () => {
  submitMessage();
  stopTimer();
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    submitMessage();
    stopTimer();
  } else {
    userIsTyping();
    finishedTypingTimeout();
  }
});

function stopTimer() {
  clearTimeout(timeout);
  typingTimeout();
}

function onRecievedName(data) {
  name = data;
  startSession();
}

function startSession() {
  window.sessionStorage.setItem("name", name);
  appendMyMessage(messages.youJoined);
  emitNewUser(name);
}

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

function debounce(fn, delay) {
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn();
    }, delay);
  };
}

function typingTimeout() {
  emitTyping({ user: name, typing: false });
}

function userIsTyping() {
  emitTyping({ user: name, typing: true });
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
