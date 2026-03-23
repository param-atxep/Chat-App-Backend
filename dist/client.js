"use strict";
const ws = new WebSocket("ws://localhost:8080");
let currentRoom = "";
const roomScreen = document.getElementById("roomScreen");
const chatScreen = document.getElementById("chatScreen");
const chatBox = document.getElementById("chatBox");
const roomTitle = document.getElementById("roomTitle");
const createInput = document.getElementById("createRoomInput");
const joinInput = document.getElementById("joinRoomInput");
const messageInput = document.getElementById("messageInput");
// 🔥 CREATE ROOM
function createRoom() {
    const room = createInput.value.trim();
    if (!room)
        return alert("Enter room name");
    currentRoom = room;
    ws.send(JSON.stringify({
        type: "join",
        room
    }));
}
// 🔥 JOIN ROOM
function joinRoom() {
    const room = joinInput.value.trim();
    if (!room)
        return alert("Enter room name");
    currentRoom = room;
    ws.send(JSON.stringify({
        type: "join",
        room
    }));
}
// 🔥 SEND MESSAGE
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message)
        return;
    ws.send(JSON.stringify({
        type: "chat",
        message
    }));
    addMessage(message, "me");
    messageInput.value = "";
}
// 🔥 RECEIVE
ws.onopen = () => {
    console.log("Connected to server");
};
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "joined") {
        roomScreen.classList.add("hidden");
        chatScreen.classList.remove("hidden");
        roomTitle.innerText = "Room: " + currentRoom;
    }
    if (data.type === "chat") {
        addMessage(data.message, "other");
    }
    if (data.type === "error") {
        alert(data.message);
    }
};
// 🔥 ADD MESSAGE UI
function addMessage(msg, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerText = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// expose to HTML
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.sendMessage = sendMessage;
