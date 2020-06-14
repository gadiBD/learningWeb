const socket = io.connect("http://localhost:3000");

export function emitNewUser(name) {
  socket.emit("new-user", name);
}

export function onNewMessage(method) {
  socket.on("new-chat-message", (data) => {
    method(`${data.name}: ${data.message}`,  false);
  });
}

export function onNewUser(method) {
  socket.on("user-connected", (name) => {
    method(`${name} connected`, false);
  });
}

export function onUserDisconnect(method) {
  socket.on("user-disconnected", (name) => {
    method(`${name} disconnected`);
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
