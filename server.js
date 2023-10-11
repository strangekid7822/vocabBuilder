const express = require('express');
// Import MongoDB client
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

console.log('Starting server.js...');

const app = express();
app.use(express.json());
app.use(cors());

// Declare a variable to hold the MongoDB database object
let db;

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    return;
  } else {
    console.log('Successfully connected to MongoDB');
  }
  // Initialize the database object
  db = client.db('vocabBuilder');
});

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

// PUT route for updating words
app.put('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const { word, meaning, synonyms, chinese_translation } = req.body;
  const collection = db.collection('words');
  collection.updateOne({ _id: id }, { $set: { word, meaning, synonyms, chinese_translation } }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: result.modifiedCount });
  });
});

// DELETE route for deleting words
app.delete('/api/words/:id', (req, res) => {
  const { id } = req.params;
  const collection = db.collection('words');
  collection.deleteOne({ _id: id }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: result.deletedCount });
  });
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
