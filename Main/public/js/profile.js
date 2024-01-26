document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-button');
  const userInputField = document.getElementById('user-input');
  const personalitySelect = document.getElementById('personality-select');
  const chatBox = document.getElementById('chat-box');
  let chatHistory = [];

  sendButton.addEventListener('click', () => {
      const message = userInputField.value;
      const personality = personalitySelect.value;

      if (message.trim()) {
          sendMessageToServer(message, personality);
          userInputField.value = '';
      }
  });

  function sendMessageToServer(message, personality) {
      chatHistory.push({ role: 'user', content: message });
      limitChatHistory();

      fetch('/api/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput: message, chatHistory, personality }),
      })
      .then(response => response.json())
      .then(data => {
          updateChatBox('You', message);
          updateChatBox(personality, data.aiResponse);

          chatHistory.push({ role: "system", content: data.aiResponse });
          limitChatHistory();
      })
      .catch(error => {
          console.error('Chat Error:', error);
      });
  }

  function updateChatBox(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message');

      if (sender === 'You') {
          messageElement.classList.add('user-message');
          messageElement.textContent = message;
      } else {
          messageElement.classList.add('system-message');
          messageElement.textContent = `${sender}: ${message}`;
      }

      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }

  function limitChatHistory() {
      if (chatHistory.length > 4) {
          chatHistory = chatHistory.slice(-4);
      }
  }
});

