var username;
var roomName;
const socket = io.connect("http://192.168.2.66:3000");

function main() {
  const messDiv = document.getElementById("messages-window");
  const input = document.getElementById("message");
  const button = document.getElementById("submit");

  const addParticipantsMessage = (data) => {
    // WORKING
    var message = `Welcome to room ${data.roomName}, `;
    if (data.numUsers === 1) {
      message += "only you are online";
    } else {
      message +=
        "there are " + data.numUsers + " participants online in the room";
    }
    addChatMessage({
      username: "Server",
      message: message,
    });
  };

  const setUsername = () => {
    username = prompt("Enter your name");
    roomName = prompt("Enter room name");
    if (username && roomName) {
      socket.emit("add user", { username: username, roomName: roomName });
    } else {
      alert("Something went wrong! Try again.");
    }
  };

  setUsername();

  const sendMessage = () => {
    var message = input.value;
    if (message) {
      input.value = "";
      addChatMessage({
        username: username,
        message: message,
      });
      socket.emit("new message", message);
    }
  };

  const addChatMessage = (data, options) => {
    const message = document.createElement("p");
    const username_element = document.createElement("b");
    const username = document.createTextNode(data.username);
    const node = document.createTextNode(": " + data.message);
    username_element.appendChild(username);
    message.appendChild(username_element);
    message.appendChild(node);
    messDiv.appendChild(message);
  };

  socket.on("login", (data) => {
    connected = true;
    addParticipantsMessage(data);
  });

  socket.on("new message", (data) => {
    if (data.roomName === roomName) {
      addChatMessage(data);
    }
  });

  socket.on("user joined", (data) => {
    message = data.username + " joined the room";
    if (data.roomName === roomName) {
      addChatMessage({
        username: "Server",
        message: message,
      });
    }
  });

  socket.on("user left", (data) => {
    message = data.username + " left";
    if (data.roomName === roomName) {
      addChatMessage({
        username: "Server",
        message: message,
      });
    }
  });

  button.onclick = sendMessage;
  document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode == "13") sendMessage();
  };
}

window.onload = main;
