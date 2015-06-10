var express = require('express');
var phone = require('phone');
var router = express.Router();

var peep = require('../lib/peep');
var render = require('../lib/render');

router.post('/login_or_register', function(req, res) {
  if (req.body && req.body.number && phone(req.body.number).length && req.body.token && req.body.contacts) {
    req.body.number = phone(req.body.number)[0];
    // Clean up contacts
    req.body.contacts = req.body.contacts.map(function(contact) {
      contact.number = phone(contact.number).length ? phone(contact.number)[0] : '';
      return contact;
    }).filter(function(contact) { return contact.number !== '' && contact.number !== req.body.number; });

    peep.isRegistered(req.body)
      .then(function(isRegistered) {
        var func = isRegistered ? 'login' : 'register';
        return peep[func](req.body).then(function(result) {
          return res.json(render.user(result));
        });
      })
      .catch(function(e) {
        res.status(400).send(e.toString());
      });
  }
});

module.exports = router;
