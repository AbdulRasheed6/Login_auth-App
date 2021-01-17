const express = require('express');

const router = express.Router();

// We need to require ensureAuthenticated to protect some resource from being accessed anyhow
const { ensureAuthenticated } = require('../config/auth')

// Welcome page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
      name: req.user.name
  }));

module.exports =router;
