import { DISCONNECTED, CONNECTED } from "../consts/messageType.js";
import messagesFormatter from "./messagesFormatter.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");

export function appendMyMessage(message) {
  appendMessage(message, "myMessage");
}

export function appendOtherMessage(message) {
  appendMessage(message, "otherMessage");
}

export function showAllPreviousMessages(messages) {
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
