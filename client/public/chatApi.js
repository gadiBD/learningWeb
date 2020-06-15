const socket = io.connect("http://localhost:3000");

const newUser = "new-user"
const newMessage = "new-chat-message"
const userConnect = "user-connected"
const userDisconnect = "user-disconnected"
const userTyping = "typing"
const sendMessage = "send-chat-message"

export function emitNewUser(name) {
  socket.emit(newUser, name);
}

export function onNewMessage(method, formatter) {
  socket.on(newMessage, (data) => {
    method(formatter(data));
  });
}

export function onNewUser(method, formatter) {
  socket.on(userConnect, (name) => {
    method(formatter(name));
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
