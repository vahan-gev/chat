var username;

const socket = io.connect("http://localhost:3000");

function main() {
  const messDiv = document.getElementById("messages-window");
  const input = document.getElementById("message");
  const button = document.getElementById("submit");

  const addParticipantsMessage = (data) => {
    var message = "Welcome, ";
    if (data.numUsers === 1) {
      message += "only you are online";
    } else {
      message += "there are " + data.numUsers + " participants online";
    }
    addChatMessage({
      username: "Server",
      message: message,
    });
  };

  const setUsername = () => {
    username = prompt("Please enter your name");

    if (username) {
      socket.emit("add user", username);
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
    addChatMessage(data);
  });

  socket.on("user joined", (data) => {
    message = data.username + " joined";
    addChatMessage({
      username: "Server",
      message: message,
    });
  });

  socket.on("user left", (data) => {
    message = data.username + " left";
    addChatMessage({
      username: "Server",
      message: message,
    });
  });

  button.onclick = sendMessage;
  document.onkeydown = (e) => {
    e = e || window.event;
    if (e.keyCode == "13") sendMessage();
  };
}

window.onload = main;
