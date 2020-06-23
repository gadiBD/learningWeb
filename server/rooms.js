const rooms = {
  JavaScript: {
    users: {},
    messages: [],
  },
  Python: {
    users: {},
    messages: [],
  },
};

function addUserToRoom(id, username, room) {
  rooms[room].users[id] = username;
}

function removeUserFromRoom(id, room) {
  console.log(room)
  console.log(rooms)
  const users = rooms[room].users;
  delete users[id];
}

function doesUsernameExistsInRoom(username, room) {
  const users = rooms[room].users;
  return Object.values(users).indexOf(username) !== -1;
}

function getRoomByUserId(id) {
    return Object.keys(rooms).find((room) => {
        const users = rooms[room].user;
        return Object.keys(users).indexOf(id) !== -1;
    })
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
  getUsername,
  getRoomByUserId,
};
