var express = require('express');
var router = express.Router();

var peep = require('../lib/peep');

router.post('/login', function(req, res) {
  if (req.body && req.body.number && req.body.token) {
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
  if (req.body && req.body.number && req.body.token && req.body.contacts) {
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
