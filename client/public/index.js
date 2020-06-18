import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
  emitGenerateName,
  onUsernameTaken,
  onConnectionSuccessful,
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
onUsernameTaken(() => {
  alert("Username was taken");
  promptName();
}, messages.usernameTaken);
onConnectionSuccessful(startSession);

if (!name) {
  promptName();
}

function promptName() {
  name = prompt(messages.promptName);
  if (!name) {
    emitGenerateName();
  } else {
    emitNewUser(name);
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

function startSession(name) {
  name = name;
  window.sessionStorage.setItem("name", name);
  appendMyMessage(messages.youJoined);
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
