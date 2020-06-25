import {
  emitCheckLogin,
  onLoginStatus,
  emitGetRooms,
  onAllRooms,
} from "../api/chatApi.js";

import messages from "../lib/messages.js";
import { roomItem, nameItem } from "../lib/sessionStorage.js";

const sendButton = document.getElementById("send-button");
const roomLabel = document.getElementById("room-label");
const roomTextbox = document.getElementById("new-room");
const roomSelect = document.getElementById("room-select");
const roomButton = document.getElementById("room-button");
const usernameInput = document.getElementById("username");
let isNewRoomInput = false;

function validateName() {
  const name = usernameInput.value;
  return name.trim();
}

function validateRoom() {
  if (isNewRoomInput){
    return roomTextbox.value.trim();
  }
  else {
    return roomSelect.value !== "-1";
  }
}

function startSession() {
  window.sessionStorage.setItem(nameItem, usernameInput.value);
  window.sessionStorage.setItem(roomItem, isNewRoomInput ? roomTextbox.value : roomSelect.value);
  window.location.href = "/chatRoom.html";
}

function handleLoginStatus(isUsernameTaken) {
  if (isUsernameTaken) {
    alert(messages.usernameTaken)
  }
  else {
    startSession()
  }
}

function toggleRoomInput() {
  if (isNewRoomInput) {
    roomLabel.innerHTML = "Choose an existing room"
    roomTextbox.style.display = "none"
    roomSelect.style.display = "block"
  }
  else {
    roomLabel.innerHTML = "Create new room"
    roomTextbox.style.display = "block"
    roomSelect.style.display = "none"
  }
  isNewRoomInput = !isNewRoomInput;
}

function addValuesToForm() {
  let name = window.sessionStorage.getItem(nameItem);
  if (name) {
    usernameInput.value = name;
  }
  let room = window.sessionStorage.getItem(roomItem)
  if (room) {
    roomSelect.value = room;
    roomTextbox.value = room;
  }
};

function addRoomsToSelect(rooms) {
  rooms.forEach((room) => {
    let option = document.createElement("option");
    option.value = room;
    option.innerHTML = room;
    roomSelect.appendChild(option);
  })
}

onLoginStatus(handleLoginStatus);
onAllRooms(addRoomsToSelect)

sendButton.addEventListener("click", () => {
  if (validateName() && validateRoom()) {
    let room = isNewRoomInput ? roomTextbox.value : roomSelect.value
    emitCheckLogin(usernameInput.value, room);
  } else {
    alert(messages.validationError);
  }
});

roomButton.addEventListener("click", toggleRoomInput);

emitGetRooms();
toggleRoomInput();
addValuesToForm();