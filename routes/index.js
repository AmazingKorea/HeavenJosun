const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'HeavenJosun' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'HeavenJosun' });
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'HeavenJosun' });
});

router.get('/submit', (req, res) => {
  res.render('submit', { title: 'HeavenJosun' });
});


module.exports = router;
