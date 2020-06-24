const {
  rooms,
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
  addRoom,
  getAllRooms,
  addConnectedMessageToRoom,
  addDisconnectedMessageToRoom,
  addRegularMessageToRoom,
  getAllMessagesInRoom,
  doesRoomExists,
  getUsername,
  getRoomByUserId,
} = require("./rooms");

const app = require("http").createServer();
const io = require("socket.io")(app, { pingTimeout: 30000 });
const PORT = 3000;
app.listen(PORT);

io.on("connection", (socket) => {
  console.log("connection");
  let currentUsername;
  let currentRoom;
  socket.on("check-login", (name, room) => {
    console.log(`Checking ${name} in room: ${room}`);
    let isUsernameTaken = false;
    if (doesRoomExists(room)) {
      isUsernameTaken = doesUsernameExistsInRoom(name, room);
    }
    socket.emit("login-status", isUsernameTaken);
  });

  socket.on("get-all-rooms", () => {
    console.log("Getting all rooms");
    socket.emit("all-rooms", getAllRooms());
  });

  socket.on("join-room", (name, room) => {
    console.log(`${name} is joining room: ${room}`);
    if (!doesRoomExists(room)) {
      addRoom(room);
    }
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit("username-taken");
    } else {
      currentUsername = name;
      currentRoom = room;

      socket.join(room);
      socket.broadcast.to(room).emit("user-connected", name);
      socket.emit("connection-successful", getAllMessagesInRoom(room));

      addUserToRoom(socket.id, name, room);
      addConnectedMessageToRoom(name, room);

      console.log(`${name} connected succefully`);
    }
  });

  socket.on("send-chat-message", (message) => {
    console.log(`${currentUsername} said "${message}" in room ${currentRoom}`);
    addRegularMessageToRoom(currentUsername, message, currentRoom);
    socket.broadcast.to(currentRoom).emit("new-chat-message", {
      message: message,
      name: currentUsername,
    });
  });

  socket.on("typing", (data) => {
    console.log(`${data.user} is ${data.typing ? "" : "not "}typing`);
    socket.broadcast.to(currentRoom).emit("typing", data);
  });

  socket.on("error", (data) => {
    console.log(`error: ${data}`);
  });

  socket.on("reconnect_failed", function () {
    console.log("Sorry, there seems to be an issue with the connection!");
  });

  socket.on("disconnect", (reason) => {
    if (currentUsername) {
      console.log(`reason: ${reason}`);
      console.log(`${currentUsername} disconnected`);
      addDisconnectedMessageToRoom(currentUsername, currentRoom);
      socket.broadcast.to(currentRoom).emit("user-disconnected", currentUsername);
      removeUserFromRoom(socket.id, currentRoom);
    }
  });
});
