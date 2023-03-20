'use strict';

const socket = io();

let messages = document.getElementById("messages");

// Main channel
socket.on("user_connect", sid => {
    let connectedMessage = document.createElement("p");
    connectedMessage.innerText = `User ${sid} has connected`;
    messages.appendChild(connectedMessage);
});

// Variables
let text = document.getElementById("chat-text");
let submit = document.getElementById("submit-btn");

submit.addEventListener("click", e => {
    e.preventDefault();

    let message = {
        "chat": text.value
    };

    // Clears chat input
    text.value = "";

    // Routes the message to the server
    socket.emit("messaging", message);
});

// Chat
socket.on("chat_message", data => {
    let chatMessage = document.createElement("p");
    chatMessage.innerText = `User ${data["id"]} says: ${data["message"]["chat"]}`;
    messages.appendChild(chatMessage);
});

// Disconnect
socket.on("user_disconnect", sid => {
    let disconnectMessage = document.createElement("p");
    disconnectMessage.innerText = `User ${sid} has disconnected`;
    messages.appendChild(disconnectMessage);
});