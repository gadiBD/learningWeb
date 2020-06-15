import {
  emitNewUser,
  onNewMessage,
  onUserDisconnect,
  onNewUser,
  onTyping,
  emitNewMessage,
  emitTyping,
} from "./api.js";

const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const typingInfo = document.getElementById("typing-info");
let timeout;
let typing = false;
let name;

if (!window.sessionStorage.getItem("name")) {
 name = prompt("What is your name?");
 name =  name ? name : "An unnamed user";
  window.sessionStorage.setItem("name", name);
}

appendMessage("You joined", true);
emitNewUser(name);

onNewMessage(appendMessage);
onNewUser(appendMessage);
onUserDisconnect(appendMessage);
onTyping(showTypingMessage);

function submitMessage() {
  messageInput.value = messageInput.value.trim();
  if (messageInput.value) {
    const message = messageInput.value;
    appendMessage(`You: ${message}`, true);
    emitNewMessage(message);
    messageInput.value = "";
  }
}

sendButton.addEventListener("click", () => {
  submitMessage();
  clearTimeout(timeout);
  typingTimeout();
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    submitMessage();
    clearTimeout(timeout);
    typingTimeout();
  } else if (e.key !== "Enter") {
    typing = true;
    emitTyping({ user: name, typing: typing });
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 3000);
  }
});

function appendMessage(message, myMessage) {
  const bdi = document.createElement("bdi");
  const messageElement = document.createElement("div");
  messageElement.appendChild(bdi);
  messageElement.setAttribute("class", myMessage ? "myMessage" : "otherMessage");
  bdi.innerText = message;
  messageContainer.append(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
  messageElement.classList.add("horizontalTrasnition");
}

function typingTimeout() {
  typing = false;
  emitTyping({ user: name, typing: typing });
}

function showTypingMessage(data) {
  if (data.typing) {
    typingInfo.innerHTML = `${data.user} is typing...`;
    typingInfo.style.display = "block";
  } else {
    typingInfo.innerHTML = "";
    typingInfo.style.display = "none";
  }
}
