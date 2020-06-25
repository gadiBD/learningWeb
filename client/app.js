const express = require("express");
const app = express();
const favicon = require('serve-favicon');

app.use("/", express.static(__dirname + "/public"));
app.use(favicon(__dirname + '/public/assets/favicon.png'));
app.use(
  "/clientSocket",
  express.static(__dirname + "/node_modules/socket.io-client/dist")
);

server = app.listen(5000);
