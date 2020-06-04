const io = require("socket.io")();
const server = io.listen(3000);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("new-chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing",  data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
