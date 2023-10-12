// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const wordForm = document.getElementById('word-form');
  if (wordForm) {
    wordForm.addEventListener('submit', addWord);
  }

  // New: Event listeners for user login and registration forms
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', registerUser);
  }
  // End of new event listeners
});

// To make the cursor focus on the word input field when the page loads
window.onload = function() {
  const wordElement = document.getElementById('word');
  if (wordElement) {
    wordElement.focus();
  }
};

// Existing function to add a word
async function addWord(event) {
  event.preventDefault();

  const wordData = {
    word: document.getElementById('word').value,
    meaning: document.getElementById('meaning').value,
    synonyms: document.getElementById('synonyms').value,
    chinese_translation: document.getElementById('chinese-translation').value,
  };

  // Existing code for adding word
  try {
    const response = await fetch('/api/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Word added with ID:', result.id);
    
    // Clear input fields
    document.getElementById('word').value = '';
    document.getElementById('meaning').value = '';
    document.getElementById('synonyms').value = '';
    document.getElementById('chinese-translation').value = '';

    // Set focus back to word input
    document.getElementById('word').focus();

  } catch (error) {
    console.error('Failed to add word:', error);
  }
}

// New function to login user
async function loginUser(event) {
  event.preventDefault();
  
  const userData = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  };

  // Code to send userData to the server for authentication will go here
}

// New function to register user
async function registerUser(event) {
  event.preventDefault();
  
  const newUserData = {
    username: document.getElementById('new-username').value,
    password: document.getElementById('new-password').value,
    email: document.getElementById('email').value,
  };

  // Code to send newUserData to the server for registration will go here
}
