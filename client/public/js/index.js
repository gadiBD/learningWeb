import {
  emitEvent,
  onEvent,
} from "../api/chatApi.js";

import { EVENTS } from "../api/events.js";
import messages from "./messagesFormatter.js";
import { ROOM_ITEM, NAME_ITEM } from "../consts/sessionStorage.js";
import { addRoomsToSelect, addRoomToSelect, validateRoomSelect } from "./roomSelectUI.js";

const roomSelect = document.getElementById("room-select");
const sendButton = document.getElementById("send-button");
const roomTextbox = document.getElementById("new-room-input");
const newRoomButton = document.getElementById("new-room-button");
const usernameInput = document.getElementById("username");

function validateName() {
  return usernameInput.value.trim();
}

function validateRoomTextbox() {
  return roomTextbox.value.trim();
}

function startSession() {
  window.sessionStorage.setItem(NAME_ITEM, usernameInput.value);
  window.sessionStorage.setItem(ROOM_ITEM, roomSelect.value);
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
  let name = window.sessionStorage.getItem(NAME_ITEM);
  if (name) {
    usernameInput.value = name;
  }
  let room = window.sessionStorage.getItem(ROOM_ITEM);
  if (room) {
    roomSelect.value = room;
    if (roomSelect.value !== room) {
      roomSelect.value = -1;
    }
    roomTextbox.value = room;
  }
}

onEvent(EVENTS.loginStatus, handleLoginStatus);
onEvent(EVENTS.roomStatus, handleRoomStatus);
onEvent(EVENTS.allRooms, (rooms) => {
  addRoomsToSelect(rooms);
  addPreviousValuesToForm();
});
onEvent(EVENTS.newRoom, addRoomToSelect);

sendButton.addEventListener("click", () => {
  if (validateName() && validateRoomSelect()) {
    emitEvent(EVENTS.loginCheck, {
      name: usernameInput.value,
      room: roomSelect.value,
    });
  } else {
    alert(messages.validationError);
  }
});

newRoomButton.addEventListener("click", () => {
  if (validateRoomTextbox()) {
    emitEvent(EVENTS.createRoom, roomTextbox.value);
  } else {
    alert(messages.roomNameEmpty);
  }
});

emitEvent(EVENTS.getAllRooms, roomTextbox.value);
