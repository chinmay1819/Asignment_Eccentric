const socket = io();
let userName;
let roomId;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    userName = prompt('Please Enter your Name: ');
} while (!userName);

do {
    roomId = prompt('Please Enter room id: ');
} while (!roomId);

// Send a 'join' event to the server to join the specified room
socket.emit('join', roomId);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: userName,
        message: message.trim(),
    };
    // Appending the message
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();
    // Send the message to the server with the room ID
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

if ('serviceWorker' in navigator && 'Notification' in window) {
      // Register service worker
      navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  
    // Request permission for notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }

socket.on('message', msg => {
  // Check if the message is not from yourself
  if (msg.user !== userName) {
      appendMessage(msg, 'incoming');
      scrollToBottom();
  
      // Check if the page is not in focus
      if (!document.hasFocus()) {
          // Display a notification
          if (Notification.permission === 'granted') {
              const notification = new Notification('New Message', {
                  body: `${msg.user}: ${msg.message}`,
                  icon: '/chat2.png' // Path to the notification icon
              });
  
          }
      }
  }
});

    function scrollToBottom(){
       messageArea.scrollTop=messageArea.scrollHeight
    }
}
