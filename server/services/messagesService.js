const { DISCONNECTED, CONNECTED, REGULAR } = require("../consts/messageType");

const  { rooms } = require("./roomsService.js");

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
  addConnectedMessageToRoom,
  addDisconnectedMessageToRoom,
  addRegularMessageToRoom,
  getAllMessagesInRoom,
};
