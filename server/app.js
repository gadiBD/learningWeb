const {
  rooms,
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
  addRoom,
  getAllRooms,
  addMessageToRoom,
  getAllMessagesInRoom,
  getUsername
} = require("./rooms");

const io = require("socket.io")();
const PORT = 3000;
const server = io.listen(PORT);

const connectionSuccessful = "connection-successful";
const usernameTaken = "username-taken";

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("check-username", (name, room) => {
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit(usernameTaken);
    } else {
      socket.emit(connectionSuccessful, name);
    }
  });

  socket.on("join-room", (name, room) => {
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit(usernameTaken);
    } else {
      console.log(`${getUsername()} connected`);
      addUserToRoom(socket.id, name, room)
      socket.broadcast.to(room).emit("user-connected", name);
      socket.emit(connectionSuccessful, name);
    }
  });

  socket.on("send-chat-message", (message, room) => {
    console.log(`${getUsername()} said "${message}"`);
    socket.broadcast.emit("new-chat-message", {
      message: message,
      name: getUsername(),
    });
  });

  socket.on("typing", (data) => {
    console.log(`${data.user} is ${data.typing ? "" : "not "}typing`);
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      console.log(`${users[socket.id]} disconnected`);
      socket.broadcast.emit("user-disconnected", users[socket.id]);
      delete users[socket.id];
    }
  });
});
