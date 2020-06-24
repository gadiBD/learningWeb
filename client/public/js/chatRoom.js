import {
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
  emitJoinRoom,
  onUsernameTaken,
  onConnectionSuccessful,
} from "../api/chatApi.js";

import { DISCONNECTED, CONNECTED } from "../lib/messageType.js";
import messagesFormatter from "../lib/messages.js";
import { roomItem, nameItem } from "../lib/sessionStorage.js";
import { debounceTimer, stopTimer } from "../lib/typingTimeout.js";

const chatContainer = document.getElementById("chat-container");
const chatTitle = document.getElementById("chat-title");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");

let name = window.sessionStorage.getItem(nameItem);
let room = window.sessionStorage.getItem(roomItem);

let finishedTypingTimeout = debounceTimer(typingTimeout, 3000);

function submitMessage() {
  messageInput.value = messageInput.value.trim();
  if (messageInput.value) {
    const message = messageInput.value;
    appendMyMessage(messagesFormatter.yourMessage(message));
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
    typingInfo.innerHTML = messagesFormatter.isTyping(data.user);
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerHTML = "";
    typingInfo.style.display = "none";
  }
}

function showAllPreviousMessages(messages) {
  messages.forEach((element) => {
    if (element.type === DISCONNECTED) {
      appendOtherMessage(messagesFormatter.otherDisconnected(element.sender));
    } else if (element.type === CONNECTED) {
      appendOtherMessage(messagesFormatter.otherJoined(element.sender));
    } else {
      appendOtherMessage(messagesFormatter.otherMessage(element.sender, element.message));
    }
  });
}

function startSession(messages) {
  showAllPreviousMessages(messages)
  appendMyMessage(messagesFormatter.youJoined)
}

onNewMessage(appendOtherMessage, (data) =>
messagesFormatter.otherMessage(data.name, data.message)
);
onNewUser(appendOtherMessage, messagesFormatter.otherJoined);
onUserDisconnect(appendOtherMessage, messagesFormatter.otherDisconnected);
onTyping(showTypingMessage);
onUsernameTaken(() => {
  alert(messagesFormatter.error);
  window.location.href = "/index.html";
});
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

(function youJoined() {
  emitJoinRoom(name, room);
  chatTitle.innerHTML = `Room name: ${room}`;
})();
