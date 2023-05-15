document.addEventListener('DOMContentLoaded', fetchWords);
  
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
  
    // Check if the words array is empty
    if (words.length === 0) {
      // If it is, display a motivational message
      const message = document.createElement('p');
      message.innerHTML = 'Looking to expand your vocabulary? <br>Get started by adding some words!';
      message.style.fontSize = '21px';
      message.style.fontWeight = '20px';
      message.style.textAlign = 'center';
      wordListElement.appendChild(message);
    } else {
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
        wordCell.classList.add('info-cell'); // Add class
        row.appendChild(wordCell);
  
        const meaningCell = document.createElement('td');
        meaningCell.textContent = word.meaning || '';
        meaningCell.classList.add('info-cell'); // Add class
        row.appendChild(meaningCell);
  
        const synonymsCell = document.createElement('td');
        synonymsCell.textContent = word.synonyms || '';
        synonymsCell.classList.add('info-cell'); // Add class
        row.appendChild(synonymsCell);
  
        const chineseTranslationCell = document.createElement('td');
        chineseTranslationCell.textContent = word.chinese_translation || '';
        chineseTranslationCell.classList.add('info-cell'); // Add class
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
        deleteButton.className = 'delete-button'; // Add a specific class to the delete button
        deleteButton.onclick = () => deleteWord(word.id, row);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
  
        table.appendChild(row);
      });
  
      wordListElement.appendChild(table);
    }
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
      editButton.classList.add('edit-mode'); // Add the 'edit-mode' class
    } else {
      makeCellReadonly(wordCell);
      makeCellReadonly(meaningCell);
      makeCellReadonly(synonymsCell);
      makeCellReadonly(chineseTranslationCell);
      editButton.textContent = 'Edit';
      editButton.classList.remove('edit-mode'); // Remove the 'edit-mode' class
  
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
    cell.classList.add('editing');
  }
  
  function makeCellReadonly(cell) {
    cell.removeAttribute('contenteditable');
    cell.classList.remove('editing');
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
  