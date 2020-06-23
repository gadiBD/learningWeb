import { emitCheckUsername, onUsernameTaken, onConnectionSuccessful } from "../api/chatApi.js";

import messages from "../lib/messages.js";

const sendButton = document.getElementById("send-button");
const roomInput = document.getElementById("room");
const usernameInput = document.getElementById("username");

let name = window.sessionStorage.getItem("name");

function validate() {
  name = usernameInput.value;
  // TODO: ROOM VALIDATION
  return name.trim();
}

function startSession(name) {
  window.sessionStorage.setItem("name", name);
  window.location.href = "/chatRoom.html";
}

onUsernameTaken(() => alert(messages.usernameTaken));
onConnectionSuccessful(startSession);

sendButton.addEventListener("click", () => {
  if (!validate()) {
    alert(messages.enterName);
  } else {
    emitCheckUsername(usernameInput.value);
  }
});

(function addValuesToForm() {
  name = window.sessionStorage.getItem("name");
  //room = window.sessionStorage.setItem("name", name);
  // TODO: Add Room: 
  usernameInput.value = name;
})();
