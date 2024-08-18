const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

var audio = new Audio('rt-1l0la173lkazu872.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

const userName = prompt("Enter Your Name To Join");
socket.emit("new-user-joined", userName);

socket.on("user-joined", name => {
    append(`${name} joined the chat`, 'right');
});

socket.on("receive", data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on("left", name => {
    append(`${name} left the chat`, 'right');
});
