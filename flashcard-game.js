document.addEventListener('DOMContentLoaded', () => {
  fetchWords().then(words => {
    if (words.length > 2) {
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
  actionButton.disabled = true;
  
  const [questionWord, correctOption, otherOptions] = generateQuestion(words);
  displayQuestion(questionWord);
  displayOptions(correctOption, otherOptions);

  document.getElementById('options').querySelectorAll('.option').forEach(option => {
    option.disabled = false;
    option.classList.remove('selected', 'correct', 'incorrect');
  });
}

function generateQuestion(words) {
  const questionWord = getRandomElement(words);
  const correctOption = generateCorrectOption(questionWord);
  const otherOptions = generateOtherOptions(words, correctOption);
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
  const otherWords = words.filter(word => word[correctOption.type] !== correctOption.text);
  let otherOptions = [];

  while (otherOptions.length < 2 && otherWords.length > 0) {
    const otherWord = getRandomElement(otherWords);
    let option = otherWord[correctOption.type];

    // Make sure the option is not empty and not already in the options
    if (option && option.length > 0 && !otherOptions.some(o => o.text === option)) {
      otherOptions.push({ type: correctOption.type, text: option });
    }

    // Remove the used word from the otherWords array to prevent endless loop when words are less than required
    const index = otherWords.indexOf(otherWord);
    if (index > -1) {
      otherWords.splice(index, 1);
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
  document.getElementById('action-button').disabled = false;
}

function handleSubmission(words) {
  const selectedOption = document.querySelector('.option.selected');
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

  document.getElementById('action-button').textContent = 'Next';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
