document.addEventListener('DOMContentLoaded', () => {
  fetchWords().then(words => {
    if (words.length > 0) {
      startNewRound(words);
    } else {
      alert('Please add some words to the word list before playing the game.');
    }

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
  const optionType = getRandomElement(optionTypes);
  return { type: optionType, text: word[optionType] };
}

function generateOtherOptions(words, correctOption) {
  const otherWords = words.filter(word => word[correctOption.type] !== correctOption.text);
  let otherOptions = [];

  while (otherOptions.length < 2) {
    const otherWord = getRandomElement(otherWords);
    const option = otherWord[correctOption.type];

    if (option && !otherOptions.some(o => o.text === option)) {
      otherOptions.push({ type: correctOption.type, text: option });
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
