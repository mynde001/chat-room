'use strict';

const socket = io();

let messages = document.getElementById("chat");
let users = document.getElementById("user");
let sessionIDLog = [];

// Main channel
socket.on("user_connect", data => {
    let connectedMessage = document.createElement("p");
    connectedMessage.innerHTML = `User <strong>&lt;${data["id"]}&gt;</strong> has connected`;
    messages.appendChild(connectedMessage);

    data["online_users"].forEach(id => {
        // Appends a session ID to online users' list and logs it in sessionIDLog array
        // Check performed in order to avoid duplication of session IDs in online users' list when broadcasting
        if (!sessionIDLog.includes(id)) {
            let userOnline = document.createElement("p");
            userOnline.innerText = id;
            users.appendChild(userOnline);
            sessionIDLog.push(id);
        };
    });
});

let text = document.getElementById("chat-input");

text.addEventListener("keypress", e => {
    if (e.key === 'Enter') {
        e.preventDefault();

        let message = {
            "user_message": text.value
        };

        // Clears chat input
        text.value = "";

        // Routes the message to the server
        if (message["user_message"] !== "") {
            socket.emit("messaging", message);
        };
    }
});

// Chat
socket.on("chat_message", data => {
    let chatMessage = document.createElement("p");
    chatMessage.innerHTML = `<strong>&lt;${data["id"]}&gt;</strong> ${data["message"]["user_message"]}`;
    messages.appendChild(chatMessage);
});

// Disconnect
socket.on("user_disconnect", sid => {
    let disconnectMessage = document.createElement("p");
    disconnectMessage.innerHTML = `User <strong>&lt;${sid}&gt;</strong> has disconnected`;
    messages.appendChild(disconnectMessage);

    // Removes inactive user(s) from online users list
    for (let p of users.children) {
        if (p.innerText === sid) {
            p.remove();
        };
    };

    // Deletes inactive users from sessionIDLog
    sessionIDLog.splice(sessionIDLog.indexOf(sid), 1);
});
