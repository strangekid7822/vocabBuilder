let lastNQuestionWords = [];
const N = 3; // Change this to the number of rounds you want to remember.

document.addEventListener('DOMContentLoaded', () => {
  fetchWords().then(words => {
    if (words.length > 5) {
      document.getElementById('not-enough-words-message').style.display = 'none';
      startNewRound(words);

      document.getElementById('options').addEventListener('click', event => {
        if (event.target.classList.contains('option')) {
          handleOptionClick(event.target);
        }
      });

      const actionButton = document.getElementById('action-button');
      actionButton.addEventListener('click', () => {
        if (actionButton.textContent === 'Submit') {
          handleSubmission(words);
        } else {
          startNewRound(words);
        }
      });

    } else {
      document.getElementById('not-enough-words-message').style.display = 'block';
      document.getElementById('question').style.display = 'none';
      document.getElementById('options').style.display = 'none';
      document.getElementById('action-button').style.display = 'none';
    }
  });
});

async function fetchWords() {
  try {
    const response = await fetch('/api/words');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch words:', error);
    return [];
  }
}

function startNewRound(words) {
  const actionButton = document.getElementById('action-button');
  actionButton.textContent = 'Submit';
  actionButton.classList.add('disabled');
  actionButton.classList.remove('next');
  
  const [questionWord, correctOption, otherOptions] = generateQuestion(words);
  displayQuestion(questionWord);
  displayOptions(correctOption, otherOptions);

  document.getElementById('options').querySelectorAll('.option').forEach(option => {
    option.disabled = false;
    option.classList.remove('selected', 'correct', 'incorrect');
  });

  const wordInfo = document.getElementById('word-info');
  wordInfo.innerHTML = '';
  wordInfo.style.display = 'none';
}

function generateQuestion(words) {
  // Exclude the last N question words when selecting a new one.
  const availableWords = words.filter(word => !lastNQuestionWords.includes(word));

  // Choose one random word to be the question word.
  const questionWord = getRandomElement(availableWords);

  // Update the list of the last N question words.
  lastNQuestionWords.push(questionWord);
  if (lastNQuestionWords.length > N) {
    lastNQuestionWords.shift();  // Remove the oldest word if the list is longer than N.
  }

  // Generate the correct option for that word.
  const correctOption = generateCorrectOption(questionWord);

  // Remove the chosen word from the word list.
  const remainingWords = availableWords.filter(word => word !== questionWord);

  // Generate the rest of the options from the remaining words.
  const otherOptions = generateOtherOptions(remainingWords, correctOption);

  return [questionWord, correctOption, otherOptions];
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCorrectOption(word) {
  const optionTypes = ['meaning', 'synonyms', 'chinese_translation'];
  let optionType = getRandomElement(optionTypes);
  let text = word[optionType];

  // Make sure the option is not empty
  while (!text || text.length === 0) {
    optionType = getRandomElement(optionTypes);
    text = word[optionType];
  }

  return { type: optionType, text: text };
}

function generateOtherOptions(words, correctOption) {
  let otherOptions = [];
  const optionTypes = ['meaning', 'synonyms', 'chinese_translation'];

  while (otherOptions.length < 2 && words.length > 0) {
    const otherWord = getRandomElement(words);
    let optionType = getRandomElement(optionTypes);
    let option = otherWord[optionType];

    // Make sure the option is not empty and not the same as the correct option
    while ((!option || option.length === 0 || option === correctOption.text) && optionTypes.length > 0) {
      optionType = getRandomElement(optionTypes);
      option = otherWord[optionType];
    }

    if (option && option.length > 0 && option !== correctOption.text) {
      otherOptions.push({ type: optionType, text: option });

      // Remove the used word from the words array to prevent selecting the same word again
      const index = words.indexOf(otherWord);
      if (index > -1) {
        words.splice(index, 1);
      }
    }
  }

  return otherOptions;
}

function displayQuestion(word) {
  document.getElementById('question').textContent = word.word;
}

function displayOptions(correctOption, otherOptions) {
  const options = [correctOption, ...otherOptions];
  shuffleArray(options);

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  options.forEach(option => {
    const optionElement = document.createElement('button');
    optionElement.classList.add('option');
    optionElement.textContent = option.text;
    optionElement.dataset.correct = option === correctOption;
    optionsContainer.appendChild(optionElement);
  });
}

function handleOptionClick(optionElement) {
  document.getElementById('options').querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });
  optionElement.classList.add('selected');
  document.getElementById('action-button').classList.remove('disabled');
}

function handleSubmission(words) {
  const selectedOption = document.querySelector('.option.selected');
  document.getElementById('action-button').textContent = 'Next';
  document.getElementById('action-button').classList.add('next');
  
  if (!selectedOption) {
    alert('Please select an option before submitting.');
    return;
  }

  const isCorrect = selectedOption.dataset.correct === 'true';
  selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');

  document.getElementById('options').querySelectorAll('.option').forEach(option => {
    option.disabled = true;
    if (option.dataset.correct === 'true') {
      option.classList.add('correct');
    }
  });

  const questionWord = document.getElementById('question').textContent;
  const word = words.find(word => word.word === questionWord);

  const wordInfo = document.getElementById('word-info');
  let htmlContent = '';

  if(word.meaning) {
    htmlContent += `<strong>Meaning:</strong> ${word.meaning} <br>`;
  }
  if(word.synonyms && Array.isArray(word.synonyms)) {
    htmlContent += `<strong>Synonyms:</strong> ${word.synonyms.join(', ')} <br>`;
  } else if (word.synonyms && typeof word.synonyms === 'string') {
    htmlContent += `<strong>Synonyms:</strong> ${word.synonyms} <br>`;
  }
  if(word.chinese_translation) {
    htmlContent += `<strong>Chinese Translation:</strong> ${word.chinese_translation} <br>`;
  }

  wordInfo.innerHTML = htmlContent;
  wordInfo.style.display = 'block';
  
  document.getElementById('action-button').textContent = 'Next';
}



function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
