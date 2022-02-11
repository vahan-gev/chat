/*
  Edit the leaving message to show in specific rooms.
  Fix the calculations of online in room.

*/

var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var users = [];
var rooms = {};
app.use(express.static("."));
app.get("/:id", function (req, res) {
  res.redirect("index.html");
});
const port = process.env.PORT || 3000;
server.listen(port);
console.log("Server started at port: " + port);

io.on("connection", (socket) => {
  var addedUser = false;
  socket.on("new message", (data) => {
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data,
      roomName: socket.roomName,
    });
  });

  socket.on("add user", ({ username, roomName }) => {
    if (addedUser) return;
    socket.username = username;
    socket.roomName = roomName;
    users.push({
      name: username,
      roomName: roomName,
    });
    addedUser = true;
    if (rooms.hasOwnProperty(socket.roomName)) {
      rooms[socket.roomName] += 1;
    } else {
      rooms[socket.roomName] = 1;
    }

    socket.emit("login", {
      roomName: roomName,
      numUsers: rooms[socket.roomName],
    });
    socket.broadcast.emit("user joined", {
      username: socket.username,
      roomName: socket.roomName,
      numUsers: rooms[socket.roomName],
    });
  });
  socket.on("disconnect", () => {
    if (addedUser) {
      --rooms[socket.roomName];
      socket.broadcast.emit("user left", {
        username: socket.username,
        roomName: socket.roomName,
        numUsers: rooms[socket.roomName],
      });
    }
  });
});
