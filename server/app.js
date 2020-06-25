const {
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
} = require("./rooms");

const app = require("http").createServer();
const io = require("socket.io")(app, { pingTimeout: 30000 });
const PORT = 3000;
app.listen(PORT);

io.on("connection", (socket) => {
  let currentUsername;
  let currentRoom;

  socket.on("create-room", (room) => {
    console.log(`Checking room: ${room}`);
    let doesRoomExist = doesRoomExists(room);

    socket.emit("room-status", {
      doesRoomExist: doesRoomExist,
      room: room,
    });
    
    if (!doesRoomExist) {
      addRoom(room);
      socket.broadcast.emit("new-room", room);
    }
  });

  socket.on("login-check", (name, room) => {
    console.log(`Checking ${name} in room: ${room}`);
    let isUsernameTaken = false;
    let isRoomTaken = doesRoomExists(room);
    if (isRoomTaken) {
      isUsernameTaken = doesUsernameExistsInRoom(name, room);
    }
    socket.emit("login-status", isUsernameTaken);
  });

  socket.on("check-login", (name, room) => {
    console.log(`Checking ${name} in room: ${room}`);
    let isUsernameTaken = false;
    let isRoomTaken = doesRoomExists(room);
    if (isRoomTaken) {
      isUsernameTaken = doesUsernameExistsInRoom(name, room);
    }
    socket.emit("login-status", {
      isUsernameTaken: isUsernameTaken,
      isRoomTaken: isRoomTaken,
    });
  });

  socket.on("get-all-rooms", () => {
    console.log("Getting all rooms");
    socket.emit("all-rooms", getAllRooms());
  });

  socket.on("join-room", (name, room) => {
    if (!doesRoomExists(room)) {
      console.log(`${name} is creating room: ${room}`);
    }
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit("username-taken");
    } else {
      console.log(`${name} is joining room: ${room}`);
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
    console.log(
      `${data.user} is ${data.typing ? "" : "not "}typing in room ${currentRoom}`
    );
    socket.broadcast.to(currentRoom).emit("typing", data);
  });

  socket.on("disconnect", (reason) => {
    if (currentUsername) {
      console.log(`User disconnect beacuse of: ${reason}`);
      console.log(`${currentUsername} disconnected from room ${currentRoom}`);
      addDisconnectedMessageToRoom(currentUsername, currentRoom);
      removeUserFromRoom(socket.id, currentRoom);
      socket.broadcast.to(currentRoom).emit("user-disconnected", currentUsername);
    }
  });
});
