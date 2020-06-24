export default {
    defaultName: "An unnamed user",
    promptName: "What is your name?",
    youJoined: "You joined",
    otherJoined: (name) => `${name} connected`,
    otherDisconnected: (name) => `${name} disconnected` ,
    yourMessage: (message) => `You: ${message}`,
    otherMessage: (name, message) => `${name}: ${message}`,
    isTyping: (user) => `${user} is typing...`,  
    usernameTaken: `This username is taken. Please choose a different name`,
    validationError: `Please make sure you have entered a name and a room`,
    error: `Error`,
}