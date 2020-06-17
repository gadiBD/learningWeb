const express = require("express");
const app = express();
const cors = require("cors", { origin: "*" });

app.use(cors({ origin: "*" }));
app.use("/", express.static(__dirname + "/public"));
app.use(
  "/clientSocket",
  express.static(__dirname + "/node_modules/socket.io-client/dist")
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server = app.listen(process.env.PORT || 5000);
