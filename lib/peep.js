var Q = require('q');
var uuid = require('node-uuid');

var db = require('./db');

var STATUS = {
  UNINVITED: 0,
  INVITED: 1,
  REGISTERED: 2
};

var kim = {
  number: '3',
  token: 'iphone-6',
  contacts: [{name: 'bob', number: '1'}, {name: 'joe', number: '2'}]
};

var bob = {
  number: '1',
  token: 'iphone-6+',
  contacts: [{name: 'lol kim', number: '3'}, {name: 'joe joe joe', number: '2'}]
};

var login = function(user) {
  return db.users.findByTokenAndNumber(user.token, user.number).then(function(result) {
    if (result) {
      return result;
    } else {
      throw new Error('Incorrect token/number combination.');
    }
  });
};

var _saveUser = function(user) {
  var contacts = user.contacts;
  var token = user.token;
  user.uid = uuid.v4();
  user.status = STATUS.REGISTERED;

  return db.users.findByNumber(user.number).then(function(result) {
    if (result) {
      user = result.user;
      if (user.status !== STATUS.REGISTERED) {
        user.token = token;
        user.contacts = contacts;
        user.status = STATUS.REGISTERED;
        return db.users.updateUser(user.uid, user).then(function() {
          return result;
        });
      } else {
        throw new Error('User is already registered.');
      }
    } else {
      return db.users.insert({
        user: user,
        names: []
      });
    }
  });
};

var _getOrCreateContact = function(contact) {
  return db.users.findByNumber(contact.number).then(function(s) {
    if (s) {
      if (s.user.status === STATUS.REGISTERED) {
        // Send push
        var text = 'Your friend who has you as ' + contact.name + ' just joined.';
        console.log(text);
      }
      return s;
    } else {
      s = {
        user: {
          uid: uuid.v4(),
          number: contact.number,
          status: STATUS.UNINVITED
        },
        names: []
      }
      return db.users.insert(s);
    }
  });
};

var register = function(user) {
  return _saveUser(user).then(function(result) {
    user = result.user;
    var contacts = user.contacts.map(function(contact) {
      return _getOrCreateContact(contact).then(function(s) {
        var c = {
          uid: user.uid,
          name: contact.name
        };
        return db.users.addName(s.user.uid, c);
      });
    });
    return Q.all(contacts).then(function() {
      return result;
    });
  });
};

var createChat = function(members, message) {
};

var getChats = function(user) {
};

var invite = function(user) {
  if (db.users[user.number]) {
    if (db.users[user.number].user.status === STATUS.UNINVITED) {
      db.users[user.number].user.status = STATUS.INVITED;
    } else {
      return;
    }
  } else {
    db.users[user.number] = {
      user: {
        uid: uuid.v4(),
        number: user.number,
        status: STATUS.INVITED
      },
      names: [] // TODO: add new user with new name
    };
  }
};

module.exports = {
  register: register,
  login: login,
  invite: invite
};
