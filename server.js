const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

console.log('Starting server.js...');

const app = express();
app.use(express.json());
app.use(cors());

let db;

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  console.log('Connected to MongoDB');
  db = client.db('vocabBuilder');
});

// User Model (New Code)
// MongoDB will automatically create the 'users' collection if it doesn't exist
const userCollection = db.collection('users');

// POST route for adding words
app.post('/api/words', (req, res) => {
  const { word, meaning, synonyms, chinese_translation } = req.body;
  const collection = db.collection('words');
  collection.insertOne({ word, meaning, synonyms, chinese_translation }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertedId });
  });
});

// GET route for fetching words
app.get('/api/words', (req, res) => {
  const collection = db.collection('words');
  collection.find({}).toArray((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Existing code for PUT and DELETE routes remain unchanged

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
