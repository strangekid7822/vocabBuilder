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

// Existing function to add word
async function addWord(event) {
  event.preventDefault();

  const wordData = {
    word: document.getElementById('word').value,
    meaning: document.getElementById('meaning').value,
    synonyms: document.getElementById('synonyms').value,
    chinese_translation: document.getElementById('chinese-translation').value,
  };

  // ... (existing code for adding word)
}

// New function to login user
async function loginUser(event) {
  event.preventDefault();
  const userData = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  };
  // Here, you would send the userData to the server for authentication
}

// New function to register user
async function registerUser(event) {
  event.preventDefault();
  const newUserData = {
    username: document.getElementById('new-username').value,
    password: document.getElementById('new-password').value,
    email: document.getElementById('email').value,
  };
  // Here, you would send the newUserData to the server for registration
}
