const socket = io.connect("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info")
const name = prompt("What is your name?");
let timeout;
let typing = false;

appendMessage("You joined", (myMessage = true));
socket.emit("new-user", name);

socket.on("new-chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`, (myMessage = false));
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`, (myMessage = false));
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

socket.on("typing", (data) => {
  if (data.typing) {
    typingInfo.innerHTML = `${data.user} is typing...`;
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerHTML = ""
    typingInfo.style.display = "none";
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, (myMessage = true));
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(message, myMessage) {
  const bdi = document.createElement("bdi");
  const messageElement = document.createElement("div");
  messageElement.appendChild(bdi);
  messageElement.setAttribute("class", myMessage ? "myMessage" : "otherMessage");
  bdi.innerText = message;
  messageContainer.append(messageElement);
}

messageInput.addEventListener("keypress", (e) => {
  if (e.key !== "Enter") {
    typing = true;
    socket.emit("typing", { "user": name, "typing": typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 3000);
  } else {
    clearTimeout(timeout);
    typingTimeout();
  }
});

function typingTimeout() {
  typing = false;
  socket.emit("typing", { "user": name, "typing": typing });
}
