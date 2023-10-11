const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

console.log('Starting server.js...');

const app = express();
app.use(express.json());
app.use(cors());

let db;

MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  console.log('Connected to MongoDB');
  db = client.db('vocabBuilder');
});

// Initialize Passport
app.use(passport.initialize());

// Passport local strategy for user authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    const collection = db.collection('users');
    collection.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

// User registration route
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const collection = db.collection('users');
  collection.insertOne({ username, password, email }, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertedId });
  });
});

// User login route
app.post('/api/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

// User logout route
app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
