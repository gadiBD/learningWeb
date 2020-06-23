import { emitCheckUsername, onUsernameTaken, onConnectionSuccessful } from "../api/chatApi.js";

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

onUsernameTaken(() => alert(messages.usernameTaken));
onConnectionSuccessful(startSession);

sendButton.addEventListener("click", () => {
  if (!validate()) {
    alert(messages.enterName);
  } else {
    emitCheckUsername(usernameInput.value, roomInput.value);
  }
});

(function addValuesToForm() {
  usernameInput.value = window.sessionStorage.getItem(nameItem) || "";
  roomInput.value = window.sessionStorage.getItem(roomItem) || "";
})();
