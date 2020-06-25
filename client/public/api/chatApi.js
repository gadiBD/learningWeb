const serverAdress = "http://localhost:3000"
const socket = io.connect(serverAdress);

const joinRoom = "join-room"
const newMessage = "new-chat-message"
const userConnect = "user-connected"
const usernameTaken = "username-taken"
const connectionSuccessful = "connection-successful"
const allRooms = "all-rooms"
const getAllRooms = "get-all-rooms"
const userDisconnect = "user-disconnected"
const userTyping = "typing"
const sendMessage = "send-chat-message"
const createRoom = "create-room"
const loginCheck = "login-check"
const loginStatus = "login-status"
const roomStatus = "room-status"
const newRoom = "new-room"

export function emitJoinRoom(name, room) {
  socket.emit(joinRoom, name, room);
}

export function onNewMessage(method, formatter) {
  socket.on(newMessage, (data) => {
    method(formatter(data));
  });
}

export function onConnectionSuccessful(method) {
  socket.on(connectionSuccessful, (messages) => {
    method(messages);
  });
}

export function onNewUser(method, formatter) {
  socket.on(userConnect, (name) => {
    method(formatter(name));
  });
}

export function onUsernameTaken(method) {
  socket.on(usernameTaken, () => {
    method();
  });
}
export function onLoginStatus(method) {
  socket.on(loginStatus, (isUsernameTaken) => {
    method(isUsernameTaken);
  });
}

export function onRoomStatus(method) {
  socket.on(roomStatus, (data) => {
    method(data);
  });
}

export function onUserDisconnect(method, formatter) {
  socket.on(userDisconnect, (name) => {
    method(formatter(name));
  });
}

export function onTyping(method) {
    socket.on(userTyping, (data) => {
      method(data);
    });
}

export function emitNewMessage(message) {
    socket.emit(sendMessage, message);
}

export function emitTyping(data) {
    socket.emit(userTyping, data);
}

export function emitCreateRoom(room) {
  socket.emit(createRoom, room);
}

export function emitLoginCheck(name, room) {
  socket.emit(loginCheck, name, room);
}

export function emitGetRooms() {
  socket.emit(getAllRooms);
}

export function onAllRooms(method) {
  socket.on(allRooms, (rooms) => {
    method(rooms);
  });
}

export function onNewRoom(method) {
  socket.on(newRoom, (room) => {
    method(room);
  });
}
