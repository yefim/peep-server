var express = require('express');
var phone = require('phone');
var router = express.Router();

var peep = require('../lib/peep');

router.post('/login', function(req, res) {
  if (req.body && req.body.number && phone(req.body.number).length && req.body.token) {
    req.body.number = phone(req.body.number)[0];
    peep.login(req.body)
      .then(function(result) {
        res.json(result);
      })
      .catch(function(e) {
        res.status(400).send(e.toString());
      });
  } else {
    res.status(400).end();
  }
});

router.post('/register', function(req, res) {
  if (req.body && req.body.number && phone(req.body.number).length && req.body.token && req.body.contacts) {
    req.body.number = phone(req.body.number)[0];
    // Clean up contacts
    req.body.contacts = req.body.contacts.map(function(contact) {
      contact.number = phone(contact.number).length ? phone(contact.number)[0] : '';
      return contact;
    }).filter(function(contact) { return contact.number !== '' && contact.number !== req.body.number; });

    peep.register(req.body)
      .then(function(result) {
        res.json(result);
      })
      .catch(function(e) {
        res.status(400).send(e.toString());
      });
  } else {
    res.status(400).end();
  }
});

module.exports = router;
