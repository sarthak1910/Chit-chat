const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var audio = new Audio("rt-1l0la173lkazu872.mp3");
let userName = "";

// Append message function
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position === "left") {
    audio.play();
  }
};

// Join chat with username
function joinChat() {
  const nameInput = document.getElementById("nameInput").value.trim();
  if (nameInput !== "") {
    userName = nameInput;
    document.getElementById("nameModal").style.display = "none";
    socket.emit("new-user-joined", userName);
  } else {
    alert("Please enter your name.");
  }
}

// Submit message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message !== "") {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  }
});

// Socket events
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});
