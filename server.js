const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

console.log('Starting server.js...');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
  db.run('CREATE TABLE words (id INTEGER PRIMARY KEY, word TEXT NOT NULL, meaning TEXT, synonyms TEXT, chinese_translation TEXT);');
});

app.post('/api/words', (req, res) => {
  const { word, meaning, synonyms, chinese_translation } = req.body;
  db.run('INSERT INTO words (word, meaning, synonyms, chinese_translation) VALUES (?, ?, ?, ?)', [word, meaning, synonyms, chinese_translation], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/words', (req, res) => {
  db.all('SELECT * FROM words', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const { word, meaning, synonyms, chinese_translation } = req.body;

  db.run('UPDATE words SET word = ?, meaning = ?, synonyms = ?, chinese_translation = ? WHERE id = ?', [word, meaning, synonyms, chinese_translation, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM words WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});