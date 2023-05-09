document.addEventListener('DOMContentLoaded', () => {
  const wordForm = document.getElementById('word-form');
  if (wordForm) {
    wordForm.addEventListener('submit', addWord);
  }
});

async function addWord(event) {
  event.preventDefault();

  const wordData = {
    word: document.getElementById('word').value,
    meaning: document.getElementById('meaning').value,
    synonyms: document.getElementById('synonyms').value,
    chinese_translation: document.getElementById('chinese-translation').value,
  };

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

  } catch (error) {
    console.error('Failed to add word:', error);
  }
}



async function fetchWords() {
  try {
    const response = await fetch('/api/words');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const words = await response.json();
    displayWords(words);
  } catch (error) {
    console.error('Failed to fetch words:', error);
  }
}


function displayWords(words) {
  const wordListElement = document.getElementById('word-list');

  // Clear any existing content
  wordListElement.innerHTML = '';

  // Create a table to display the words
  const table = document.createElement('table');

  // Add table header
  const header = document.createElement('tr');
  header.innerHTML = `
    <th>Word</th>
    <th>Meaning</th>
    <th>Synonyms</th>
    <th>Chinese Translation</th>
    <th>Edit</th>
    <th>Delete</th>
  `;
  table.appendChild(header);

  words.forEach(word => {
    const row = document.createElement('tr');

    const wordCell = document.createElement('td');
    wordCell.textContent = word.word;
    row.appendChild(wordCell);

    const meaningCell = document.createElement('td');
    meaningCell.textContent = word.meaning || '';
    row.appendChild(meaningCell);

    const synonymsCell = document.createElement('td');
    synonymsCell.textContent = word.synonyms || '';
    row.appendChild(synonymsCell);

    const chineseTranslationCell = document.createElement('td');
    chineseTranslationCell.textContent = word.chinese_translation || '';
    row.appendChild(chineseTranslationCell);

    // Edit button cell
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => toggleEditMode(row, word.id);
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Delete button cell
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteWord(word.id, row);
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    table.appendChild(row);
  });

  wordListElement.appendChild(table);
}

function toggleEditMode(row, wordId) {
  const isEditing = row.classList.toggle('editing');

  const cells = row.querySelectorAll('td');
  const wordCell = cells[0];
  const meaningCell = cells[1];
  const synonymsCell = cells[2];
  const chineseTranslationCell = cells[3];
  const editButton = cells[4].querySelector('button');

  if (isEditing) {
    makeCellEditable(wordCell);
    makeCellEditable(meaningCell);
    makeCellEditable(synonymsCell);
    makeCellEditable(chineseTranslationCell);
    editButton.textContent = 'Save';
  } else {
    makeCellReadonly(wordCell);
    makeCellReadonly(meaningCell);
    makeCellReadonly(synonymsCell);
    makeCellReadonly(chineseTranslationCell);
    editButton.textContent = 'Edit';

    const updatedWord = {
      word: wordCell.textContent,
      meaning: meaningCell.textContent,
      synonyms: synonymsCell.textContent,
      chinese_translation: chineseTranslationCell.textContent,
    };
    updateWord(wordId, updatedWord);
  }
}

function makeCellEditable(cell) {
  cell.setAttribute('contenteditable', 'true');
}

function makeCellReadonly(cell) {
  cell.removeAttribute('contenteditable');
}

async function updateWord(wordId, updatedWord) {
  try {
    const response = await fetch(`/api/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWord),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    console.log('Word updated with ID:', wordId);
  } catch (error) {
    console.error('Failed to update word:', error);
  }
}

async function deleteWord(wordId, row) {
  const confirmation = confirm('Are you sure you want to delete this word?');

  if (!confirmation) {
    return;
  }

  try {
    const response = await fetch(`/api/words/${wordId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    console.log('Word deleted with ID:', wordId);
    row.remove(); // Remove the row from the table
  } catch (error) {
    console.error('Failed to delete word:', error);
  }
}