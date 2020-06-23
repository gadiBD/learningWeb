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
  let currentUsername;
  let currentRoom;
  socket.on("check-username", (name, room) => {
    console.log(`Checking ${name} in room: ${room}`)
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit(usernameTaken);
    } else {
      socket.emit(connectionSuccessful, name);
    }
  });

  socket.on("join-room", (name, room) => {
    console.log(`${name} is joining room: ${room}`)
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit(usernameTaken);
    } else {
      currentUsername = name
      currentRoom = room;
      console.log(`${name} connected succefully`);
      addUserToRoom(socket.id, name, room)
      socket.join(room)
      socket.broadcast.to(room).emit("user-connected", name);
      socket.emit(connectionSuccessful);
    }
  });

  socket.on("send-chat-message", (message) => {
    console.log(`${currentUsername} said "${message}" in room ${currentRoom}`);
    socket.broadcast.to(currentRoom).emit("new-chat-message", {
      message: message,
      name: currentUsername,
    });
  });

  socket.on("typing", (data) => {
    console.log(`${data.user} is ${data.typing ? "" : "not "}typing`);
    socket.broadcast.to(currentRoom).emit("typing", data);
  });

  socket.on("disconnect", () => {
    if (currentUsername) {
      console.log(`${currentUsername} disconnected`);
      socket.broadcast.to(currentRoom).emit("user-disconnected", currentUsername);
      removeUserFromRoom(socket.id, currentRoom)
    }
  });
});
