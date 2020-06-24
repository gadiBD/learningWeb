import {
  emitCheckUsername,
  onUsernameTaken,
  onConnectionSuccessful,
  onUsernameStatus,
} from "../api/chatApi.js";

import messages from "../lib/messages.js";
import { roomItem, nameItem } from "../lib/sessionStorage.js";

const sendButton = document.getElementById("send-button");
const roomInput = document.getElementById("room");
const usernameInput = document.getElementById("username");

function validate() {
  const name = usernameInput.value;
  return name.trim();
}

function startSession() {
  window.sessionStorage.setItem(nameItem, usernameInput.value);
  window.sessionStorage.setItem(roomItem, roomInput.value);
  window.location.href = "/chatRoom.html";
}

function handleUsernameStatus(isUsernameTaken) {
  if (isUsernameTaken) {
    alert(messages.usernameTaken)
  }
  else {
    startSession()
  }
}

onUsernameStatus(handleUsernameStatus);

sendButton.addEventListener("click", () => {
  if (!validate()) {
    alert(messages.enterName);
  } else {
    emitCheckUsername(usernameInput.value, roomInput.value);
  }
});

(function addValuesToForm() {
  let name = window.sessionStorage.getItem(nameItem);
  if (name) {
    usernameInput.value = name;
  }
  let room = window.sessionStorage.getItem(roomItem)
  if (room) {
    roomInput.value = room;
  }
})();
