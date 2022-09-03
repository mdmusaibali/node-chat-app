const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//env
const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, "./../public");
app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {
  console.log("New web socket connection");
  socket.emit("countUpdated", count);
  socket.on("increment", () => {
    count++;
    // socket.emit("countUpdated", count);
    io.emit("countUpdated", count);
  });
});

server.listen(port, () => {
  console.log("Listening at ", port);
});