const serverAdress = "http://localhost:3000"
const socket = io.connect(serverAdress);

export function emitEvent(event, payload) {
  socket.emit(event, payload);
}

export function onEvent(event, method) {
  socket.on(event, (payload) => {
    method(payload);
  });
}
