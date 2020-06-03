const socket = io.connect('http://localhost:3000')
// socket.on('connect', function(data) {
//   socket.emit('join', 'Hello World from client');
// });
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined', myMessage=true)
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, myMessage=false)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`, myMessage=false)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`, myMessage=true)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message, myMessage) {
  const messageElement = document.createElement('div')
  messageElement.setAttribute("class", myMessage ? "myMessage" : "otherMessage")
  messageElement.innerText = message
  messageContainer.append(messageElement)
}