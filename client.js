document.addEventListener('DOMContentLoaded', () => {
  const wordForm = document.getElementById('word-form');
  if (wordForm) {
    wordForm.addEventListener('submit', addWord);
  }
});

// To make the cursor focus on the word input field when the page loads
window.onload = function() {
  const wordElement = document.getElementById('word');
  if (wordElement) {
    wordElement.focus();
  }
};

async function addWord(event) {
  event.preventDefault();

  const wordData = {
    word: document.getElementById('word').value,
    meaning: document.getElementById('meaning').value,
    synonyms: document.getElementById('synonyms').value,
    chinese_translation: document.getElementById('chinese-translation').value,
  };

  // Check if the word is empty
  if (!wordData.word || wordData.word.trim() === '') {
    alert('The word must not be empty.');
    return;
  }

  // Check if at least one of the fields: 'Meaning', 'Synonyms', 'Chinese translation' is not empty
  if (!wordData.meaning && !wordData.synonyms && !wordData.chinese_translation) {
    alert('At least one of the fields: "Meaning", "Synonyms", or "Chinese translation" must not be empty.');
    return;
  }

  // Check if the word already exists
  try {
    const wordsResponse = await fetch('/api/words');
    if (!wordsResponse.ok) {
      throw new Error(`HTTP error: ${wordsResponse.status}`);
    }
    const words = await wordsResponse.json();
    const existingWord = words.find(word => word.word.toLowerCase() === wordData.word.toLowerCase());

    if (existingWord) {
      alert('The word already exists in the list.');
      return;
    }
  } catch (error) {
    console.error('Failed to check for duplicate words:', error);
  }

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
