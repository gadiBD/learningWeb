const rooms = {
  room1: {
    users: {},
    messages: [],
  },
};

function addUserToRoom(id, username, room) {
  rooms[rooms].username[id] = username;
}

function removeUserFromRoom(id, room) {
  const users = rooms[room].users;
  delete users[id];
}

function doesUsernameExistsInRoom(username, room) {
  const users = rooms[room].users;
  return Object.values(users).indexOf(username) !== -1;
}

function getUsername(id, room) {
    return rooms[room].users[id];
}

function addRoom(room) {
  rooms[room] = {};
}

function getAllRooms() {
  return Object.keys(rooms);
}

function addMessageToRoom(sender, message, room) {
  rooms[room].messages.push({ sender: sender, message: messge });
}

function getAllMessagesInRoom(room) {
  return rooms[room].messages;
}

module.exports = {
  rooms,
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
  addRoom,
  getAllRooms,
  addMessageToRoom,
  getAllMessagesInRoom,
  getUsername
};
