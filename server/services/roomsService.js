const rooms = {};

function doesRoomExists(room) {
  return Object.keys(rooms).indexOf(room) !== -1;
}

function addRoom(room) {
  rooms[room] = {
    users: {},
    messages: [],
  }
}

function getAllRooms() {
  return Object.keys(rooms);
}

module.exports = {
  rooms,
  addRoom,
  getAllRooms,
  doesRoomExists,
};
