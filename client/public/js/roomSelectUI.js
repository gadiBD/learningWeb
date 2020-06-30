const roomSelect = document.getElementById("room-select");

export function validateRoomSelect() {
  return roomSelect.value !== "-1";
}

export function addRoomsToSelect(rooms) {
  rooms.forEach(addRoomToSelect);
}

export function addRoomToSelect(room) {
  let option = document.createElement("option");
  option.value = room;
  option.innerText = room;
  roomSelect.appendChild(option);
}