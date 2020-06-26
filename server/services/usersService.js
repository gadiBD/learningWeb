const  { rooms } = require("./roomsService.js");

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

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
};
