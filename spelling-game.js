window.onload = function() {
  fetchWords();
  document.getElementById('word-input').value = ''; // Ensure the input field is empty when the page loads
}

let wordList = [];
let currentWord;
let submitButton = document.getElementById('submit-answer');
let inputField = document.getElementById('word-input');
let correctAnswerDiv = document.getElementById('correct-answer');

async function fetchWords() {
  try {
    const response = await fetch('/api/words');
    const data = await response.json();
    wordList = data;
    if (wordList.length > 0) {
      pickRandomWord();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function pickRandomWord() {
  let randomIndex = Math.floor(Math.random() * wordList.length);
  currentWord = wordList[randomIndex];
  displayWordInfo();
}

function displayWordInfo() {
  document.getElementById('word-meaning').textContent = currentWord.meaning;
  document.getElementById('word-synonym').textContent = currentWord.synonyms;
  document.getElementById('word-chinese').textContent = currentWord.chinese_translation;
}

submitButton.addEventListener('click', function(e) {
  e.preventDefault();  // prevent form submission
  if (submitButton.textContent === 'Submit') {
    if (inputField.value === '') {
      alert('You have to input the answer before submitting.');
      return;  // stop executing the rest of the function
    } else if (inputField.value === currentWord.word) {
      // Correct answer
      inputField.style.backgroundColor = 'lightgreen';
      displayCorrectAnswer();
    } else {
      // Incorrect answer
      inputField.style.backgroundColor = 'lightpink';
      displayIncorrectAnswer();
    }
    inputField.disabled = true;
    submitButton.textContent = 'Next';
  } else {
    // Reset for next word
    inputField.value = '';
    inputField.style.backgroundColor = '';
    inputField.disabled = false;
    correctAnswerDiv.innerHTML = '';  // clear the correct answer div
    submitButton.textContent = 'Submit';
    pickRandomWord();
  }
});


function displayCorrectAnswer() {
  correctAnswerDiv.innerHTML = "<span style='color: gray;'>Correct answer!</span>";
}

function displayIncorrectAnswer() {
  correctAnswerDiv.innerHTML = "<span style='color: gray;'>Incorrect. The correct answer was: </span><span style='color: red; font-weight: bold;'>" + currentWord.word + "</span>";
}

inputField.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    submitButton.click();
  }
});
