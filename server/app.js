const io = require("socket.io")();
const server = io.listen(3000);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    console.log(`${name} connected`)
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("send-chat-message", (message) => {
    console.log(`${users[socket.id]} said "${message}"`)
    socket.broadcast.emit("new-chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("typing", (data) => {
    console.log(`${data.user} is ${data.typing ? "" : "not "}typing`)
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} disconnected`)
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
