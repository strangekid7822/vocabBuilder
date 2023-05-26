let wordList = [];

async function fetchWords() {
  try {
    const response = await fetch('/api/words');
    const data = await response.json();
    wordList = data;
    if (wordList.length < 6) {
      document.getElementById('game-container').style.display = 'none'; // Hide game container
      let warningMessage = document.createElement('h3');
      warningMessage.textContent = "To play the game, please save more than 6 words.";
      warningMessage.style.textAlign = 'center';
      document.querySelector('.container').appendChild(warningMessage);
    } else {
      pickRandomWord();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

let currentWord;

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

window.onload = function() {
  console.log("Spelling game JS is linked correctly!");
  document.getElementById('word-input').focus();  // Automatically focus the input field
  fetchWords();  // Call fetchWords here
}
