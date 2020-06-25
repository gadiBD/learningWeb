const { DISCONNECTED, CONNECTED, REGULAR } = require("./messageType");

const rooms = {};

function addUserToRoom(id, username, room) {
  rooms[room].users[id] = username;
}

function removeUserFromRoom(id, room) {
  const users = rooms[room].users;
  delete users[id];
}

function doesUsernameExistsInRoom(username, room) {
  const users = rooms[room].users;
  return Object.values(users).indexOf(username) !== -1;
}

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

function addConnectedMessageToRoom(sender, room) {
  addMessageToRoom(sender, "", CONNECTED, room)
}

function addDisconnectedMessageToRoom(sender, room) {
  addMessageToRoom(sender, "", DISCONNECTED, room)
}

function addRegularMessageToRoom(sender, message, room) {
  addMessageToRoom(sender, message,  REGULAR, room)}

function addMessageToRoom(sender, message, messageType, room) {
  rooms[room].messages.push({ sender: sender, message: message, type: messageType });
}

function getAllMessagesInRoom(room) {
  return rooms[room].messages;
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
  addRoom,
  getAllRooms,
  addConnectedMessageToRoom,
  addDisconnectedMessageToRoom,
  addRegularMessageToRoom,
  getAllMessagesInRoom,
  doesRoomExists,
};
