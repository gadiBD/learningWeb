import { emitEvent, onEvent } from "../api/chatApi.js";

import {
  appendMyMessage,
  appendOtherMessage,
  showAllPreviousMessages,
} from "./messagesUI.js";

import { EVENTS } from "../api/events.js";
import messagesFormatter from "./messagesFormatter.js";
import { ROOM_ITEM, NAME_ITEM } from "../consts/sessionStorage.js";
import { debounceTimer, stopTimer } from "./typingTimeout.js";
import { showTypingMessage } from "./typingUI.js";

const disconnectButton = document.getElementById("disconnect-button")
const roomName = document.getElementById("room-name");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");

const name = window.sessionStorage.getItem(NAME_ITEM);
const room = window.sessionStorage.getItem(ROOM_ITEM);

const finishedTypingTimeout = debounceTimer(typingTimeout, 3000);

function submitMessage() {
  messageInput.value = messageInput.value.trim();
  if (messageInput.value) {
    const message = messageInput.value;
    appendMyMessage(messagesFormatter.yourMessage(message));
    emitEvent(EVENTS.sendMessage, message);
    messageInput.value = "";
  }
}

function typingTimeout() {
  emitEvent(EVENTS.userTyping, { user: name, typing: false });
}

function userIsTyping() {
  emitEvent(EVENTS.userTyping, { user: name, typing: true });
}

function startSession(messages) {
  showAllPreviousMessages(messages);
  appendMyMessage(messagesFormatter.youJoined);
}

function validateSession() {
  return sessionStorage.getItem(ROOM_ITEM) && sessionStorage.getItem(NAME_ITEM);
}

function redirectError() {
  alert(messagesFormatter.error);
  window.location.href = "/index.html";
}

onEvent(EVENTS.newMessage, (payload) => {
  appendOtherMessage(messagesFormatter.otherMessage(payload.name, payload.message));
});
onEvent(EVENTS.userConnect, (payload) => {
  appendOtherMessage(messagesFormatter.otherJoined(payload));
});
onEvent(EVENTS.userDisconnect, (payload) => {
  appendOtherMessage(messagesFormatter.otherDisconnected(payload));
});
onEvent(EVENTS.userTyping, showTypingMessage);
onEvent(EVENTS.usernameTaken, redirectError);
onEvent(EVENTS.connectionSuccessful, startSession);

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

disconnectButton.addEventListener("click", () => {
  emitEvent(EVENTS.disconnect)
  window.location.href = "/index.html";
});

(function youJoined() {
  if (validateSession()) {
    emitEvent(EVENTS.joinRoom, { name: name, room: room });
    roomName.innerText = room;
  } else {
    redirectError();
  }
})();
