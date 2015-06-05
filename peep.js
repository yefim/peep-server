var STATUS = {
  UNINVITED: 0,
  INVITED: 1,
  REGISTERED: 2
};

var uniqueId = (function() {
  var id = 0;
  return function() {
    return id++;
  };
})();

var kim = {
  number: '3',
  contacts: [{name: 'bob', number: '1'}, {name: 'joe', number: '2'}]
};

var bob = {
  number: '1',
  contacts: [{name: 'lol kim', number: '3'}, {name: 'joe joe joe', number: '2'}]
};

var db = {
  users: {}, // number -> {names: [], user: {} }
};

var register = function(user) {
  var contacts = user.contacts;
  user.id = uniqueId();
  user.status = STATUS.REGISTERED;

  // Save user in DB
  if (db.users[user.number]) {
    user = db.users[user.number].user;
    if (user.status !== STATUS.REGISTERED) {
      user.status = STATUS.REGISTERED;
      user.contacts = contacts;
    } else {
      return;
    }
  } else {
    db.users[user.number] = {
      user: user,
      names: []
    };
  }

  // Save his/her contacts
  contacts.forEach(function(contact) {
    var s = db.users[contact.number];
    if (s) {
      if (s.user.status === STATUS.REGISTERED) {
        // Send push
        var text = 'Your friend who has you as ' + contact.name + ' just joined.';
        console.log(text);
      }
    } else {
      s = {
        user: {
          id: uniqueId(),
          number: contact.number,
          status: STATUS.UNINVITED
        },
        names: []
      };
      db.users[contact.number] = s;
    }
    var c = {
      name: contact.name,
      id: user.id
    };
    s.names.push(c);
  });
  return db.users[user.number];
};

var chat = function(sender, recipient, message) {
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
        id: uniqueId(),
        number: user.number,
        status: STATUS.INVITED
      },
      names: [] // TODO: add new user with new name
    };
  }
};

var names = function(user) {
  return db.users[user.number].names;
};

register(kim);
register(bob);

console.log(names(kim));
console.log(names(bob));
console.log(names({number: '2'}));

console.log(db.users);
