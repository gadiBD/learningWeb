const io = require("socket.io")();
const PORT = 3000;
const server = io.listen(PORT);
const users = {};
const defaultName = "An unnamed user";
let unnamedUserCounter = 0;

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    let doesNameExists = Object.values(users).indexOf(name) !== -1;
    if (doesNameExists) {
      name = generateName();
      socket.emit("username-taken", name);
    }
    console.log(`${name} connected`);
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("generate-name", () => {
    name = generateName();
    socket.emit("generated-name", name);
  });

  socket.on("send-chat-message", (message) => {
    console.log(`${users[socket.id]} said "${message}"`);
    socket.broadcast.emit("new-chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("typing", (data) => {
    console.log(`${data.user} is ${data.typing ? "" : "not "}typing`);
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} disconnected`);
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });

  function generateName() {
    let doesNameExists 
    do {
      unnamedUserCounter++;
      name = `${defaultName} ${unnamedUserCounter}`;
      doesNameExists = Object.values(users).indexOf(name) !== -1;
    } while (doesNameExists);
    return `${defaultName} ${unnamedUserCounter}`;
  }
});
