var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var users = [];

app.use(express.static("."));
app.get("/", function (req, res) {
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
    });
  });

  socket.on("add user", (username) => {
    if (addedUser) return;
    socket.username = username;
    users.push({
      name: username,
    });
    addedUser = true;
    socket.emit("login", {
      numUsers: users.length,
    });
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: users.length,
    });
  });
  socket.on("disconnect", () => {
    if (addedUser) {
      --users.length;
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: users.length,
      });
    }
  });
});
