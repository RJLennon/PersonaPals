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

          chatHistory.push({ role: personality, content: data.aiResponse });
          limitChatHistory();
      })
      .catch(error => {
          console.error('Chat Error:', error);
      });
  }

  function updateChatBox(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${sender}: ${message}`;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }

  function limitChatHistory() {
      if (chatHistory.length > 4) {
          chatHistory = chatHistory.slice(-4);
      }
  }
});


/* const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document.querySelector('#project-funding').value.trim();
  const description = document.querySelector('#project-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler); */
