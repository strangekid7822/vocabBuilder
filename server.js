const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

console.log('Starting server.js...');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Passport
app.use(passport.initialize());

// MongoDB database object
let db;

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  console.log('Connected to MongoDB');
  db = client.db('vocabBuilder');
});

// Passport Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    // TODO: Implement user authentication logic here
    return done(null, false, { message: 'Incorrect username or password.' });
  }
));

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
