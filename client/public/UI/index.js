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
} from "../api/chatApi.js";

import messages from "../lib/messages.js";

import {debounceTimer, stopTimer} from "../lib/typingTimeout.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");

let name = window.sessionStorage.getItem("name");
let finishedTypingTimeout = debounceTimer(typingTimeout, 3000)

function promptName() {
  name = prompt(messages.promptName);
  if (!name) {
    emitGenerateName();
  } else {
    emitNewUser(name);
  }
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
  moveScrollbar();
  messageElement.classList.add("horizontalTrasnition");
}

function moveScrollbar() {
  chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
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

onNewMessage(appendOtherMessage, (data) =>
  messages.otherMessage(data.name, data.message)
);
onNewUser(appendOtherMessage, messages.otherJoined);
onUserDisconnect(appendOtherMessage, messages.otherDisconnected);
onTyping(showTypingMessage);
onUsernameTaken(() => {
  alert(messages.usernameTaken);
  promptName();
}, messages.usernameTaken);
onConnectionSuccessful(startSession);

sendButton.addEventListener("click", () => {
  submitMessage();
  stopTimer(typingTimeout);
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    submitMessage();
    stopTimer(typingTimeout);
  } else {
    userIsTyping();
    finishedTypingTimeout();
  }
});

if (!name) {
  promptName();
}
