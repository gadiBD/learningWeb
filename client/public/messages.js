export default {
    defaultName: "An unnamed user",
    promptName: "What is your name?",
    youJoined: "You joined",
    otherJoined: (name) => `${name} connected`,
    otherDisconnected: (name) => `${name} disconnected` ,
    yourMessage: (message) => `You: ${message}`,
    otherMessage: (name, message) => `${name}: ${message}`,
    isTyping: (user) => `${user} is typing...`,  
    usernameTaken: (name) => `The username was taken instead we have given you the username: ${name}`,
}