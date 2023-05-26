window.onload = function() {
    console.log("Spelling game JS is linked correctly!");
}

let wordList = [];

async function fetchWords() {
  try {
    const response = await fetch('/api/words');
    const data = await response.json();
    wordList = data;
    pickRandomWord();
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

fetchWords();  // Call fetchWords here
