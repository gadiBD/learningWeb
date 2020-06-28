import {
  emitLoginCheck,
  onLoginStatus,
  emitGetRooms,
  onAllRooms,
  onNewRoom,
  onRoomStatus,
  emitCreateRoom,
} from "../api/chatApi.js";

import messages from "../lib/messages.js";
import { roomItem, nameItem } from "../lib/sessionStorage.js";

const sendButton = document.getElementById("send-button");
const roomTextbox = document.getElementById("new-room-input");
const roomSelect = document.getElementById("room-select");
const newRoomButton = document.getElementById("new-room-button");
const usernameInput = document.getElementById("username");

function validateName() {
  return usernameInput.value.trim();
}

function validateRoomSelect() {
  return roomSelect.value !== "-1";
}

function validateRoomTextbox() {
  return roomTextbox.value.trim();
}

function startSession() {
  window.sessionStorage.setItem(nameItem, usernameInput.value);
  window.sessionStorage.setItem(roomItem, roomSelect.value);
  window.location.href = "/chatRoom.html";
}

function handleRoomStatus(data) {
  if (data.doesRoomExist) {
    alert(messages.roomTaken);
  } else {
    addRoomToSelect(data.room);
    roomSelect.value = data.room;
  }
}

function handleLoginStatus(isUsernameTaken) {
  if (isUsernameTaken) {
    alert(messages.usernameTaken);
  } else {
    startSession();
  }
}

function addPreviousValuesToForm() {
  let name = window.sessionStorage.getItem(nameItem);
  if (name) {
    usernameInput.value = name;
  }
  let room = window.sessionStorage.getItem(roomItem);
  if (room) {
    roomSelect.value = room;
    if (roomSelect.value !== room) {
      roomSelect.value = -1;
    }
    roomTextbox.value = room;
  }
}

function addRoomsToSelect(rooms) {
  rooms.forEach(addRoomToSelect);
}

function addRoomToSelect(room) {
  let option = document.createElement("option");
  option.value = room;
  option.innerHTML = room;
  roomSelect.appendChild(option);
}

onLoginStatus(handleLoginStatus);
onRoomStatus(handleRoomStatus);
onAllRooms((rooms) => {
  addRoomsToSelect(rooms);
  addPreviousValuesToForm();
});
onNewRoom(addRoomToSelect);

sendButton.addEventListener("click", () => {
  if (validateName() && validateRoomSelect()) {
    emitLoginCheck(usernameInput.value, roomSelect.value);
  } else {
    alert(messages.validationError);
  }
});

newRoomButton.addEventListener("click", () => {
  if (validateRoomTextbox()) {
    emitCreateRoom(roomTextbox.value);
  } else {
    alert(messages.roomNameEmpty);
  }
});

emitGetRooms();
