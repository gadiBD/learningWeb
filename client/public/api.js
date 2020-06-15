const socket = io.connect("http://localhost:3000");
import messages from "./messages.js";

export function emitNewUser(name) {
  socket.emit("new-user", name);
}

export function onNewMessage(method) {
  socket.on("new-chat-message", (data) => {
    method(messages.otherMessage(data.name, data.message));
  });
}

export function onNewUser(method) {
  socket.on("user-connected", (name) => {
    method(messages.otherJoined(name));
  });
}

export function onUserDisconnect(method) {
  socket.on("user-disconnected", (name) => {
    method(messages.otherDisconnected(name));
  });
}

export function onTyping(method) {
    socket.on("typing", (data) => {
      method(data);
    });
}

export function emitNewMessage(message) {
    socket.emit("send-chat-message", message);
}

export function emitTyping(data) {
    socket.emit("typing", data);
}
