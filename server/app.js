const {
  addRoom,
  getAllRooms,
  doesRoomExists,
} = require("./services/roomsService");

const {
  EVENTS
} = require("./consts/events");

const {
  addUserToRoom,
  removeUserFromRoom,
  doesUsernameExistsInRoom,
} = require("./services/usersService");

const {
  addConnectedMessageToRoom,
  addDisconnectedMessageToRoom,
  addRegularMessageToRoom,
  getAllMessagesInRoom,
} = require("./services/messagesService");

const app = require("http").createServer();
const io = require("socket.io")(app, { pingTimeout: 30000 });
const PORT = 3000;
app.listen(PORT);

io.on("connection", (socket) => {
  let currentUsername;
  let currentRoom;

  socket.on(EVENTS.createRoom, (room) => {
    console.log(`Checking room: ${room}`);
    let doesRoomExist = doesRoomExists(room);

    socket.emit(EVENTS.roomStatus, {
      doesRoomExist: doesRoomExist,
      room: room,
    });
    
    if (!doesRoomExist) {
      addRoom(room);
      socket.broadcast.emit(EVENTS.newRoom, room);
    }
  });

  socket.on(EVENTS.loginCheck, ({name, room}) => {
    console.log(`Checking ${name} in room: ${room}`);
    let isUsernameTaken = false;
    let isRoomTaken = doesRoomExists(room);
    if (isRoomTaken) {
      isUsernameTaken = doesUsernameExistsInRoom(name, room);
    }
    socket.emit(EVENTS.loginStatus, isUsernameTaken);
  });

  socket.on(EVENTS.getAllRooms, () => {
    console.log("Getting all rooms");
    socket.emit(EVENTS.allRooms, getAllRooms());
  });

  socket.on(EVENTS.joinRoom, ({name, room}) => {
    if (!doesRoomExists(room)) {
      addRoom(room);
      currentRoom = room;
      console.log(`${name} is creating room: ${room}`);
    }
    if (doesUsernameExistsInRoom(name, room)) {
      socket.emit(EVENTS.usernameTaken);
    } else {
      console.log(`${name} is joining room: ${room}`);
      currentUsername = name;
      currentRoom = room;
      socket.join(room);
      socket.broadcast.to(room).emit(EVENTS.userConnect, name);
      socket.emit(EVENTS.connectionSuccessful, getAllMessagesInRoom(room));
      addUserToRoom(socket.id, name, room);
      addConnectedMessageToRoom(name, room);
      console.log(`${name} connected succefully`);
    }
  });

  socket.on(EVENTS.sendMessage, (message) => {
    console.log(`${currentUsername} said "${message}" in room ${currentRoom}`);
    addRegularMessageToRoom(currentUsername, message, currentRoom);
    socket.broadcast.to(currentRoom).emit(EVENTS.newMessage, {
      message: message,
      name: currentUsername,
    });
  });

  socket.on(EVENTS.userTyping, (data) => {
    console.log(
      `${data.user} is ${data.typing ? "" : "not "}typing in room ${currentRoom}`
    );
    socket.broadcast.to(currentRoom).emit(EVENTS.userTyping, data);
  });

  socket.on(EVENTS.disconnect, (reason) => {
    if (currentUsername) {
      console.log(`User disconnect beacuse of: ${reason}`);
      console.log(`${currentUsername} disconnected from room ${currentRoom}`);
      addDisconnectedMessageToRoom(currentUsername, currentRoom);
      removeUserFromRoom(socket.id, currentRoom);
      socket.broadcast.to(currentRoom).emit(EVENTS.userDisconnect, currentUsername);
    }
  });
});
