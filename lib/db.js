var pmongo = require('promised-mongo');
var mongoDb = 'peep';

var basic = {
  findOne: function(collection, fields) {
    var c = pmongo(mongoDb).collection(collection);
    return c.findOne(fields);
  },
  find: function(collection, fields) {
    var c = pmongo(mongoDb).collection(collection);
    return c.find(fields);
  },
  insert: function(collection, obj) {
    var c = pmongo(mongoDb).collection(collection);
    return c.insert(obj);
  },
  update: function(collection, fields, options) {
    var c = pmongo(mongoDb).collection(collection);
    return c.update(fields, options);
  }
};

var users = {
  findByNumber: function(number) {
    return basic.findOne('users', {'user.number': number});
  },
  findByTokenAndNumber: function(token, number) {
    return basic.findOne('users', {'user.token': token, 'user.number': number});
  },
  updateUser: function(userId, user) {
    return basic.update('users', {'user.uid': userId}, {'$set': {user: user}});
  },
  addName: function(userId, name) {
    return basic.update('users', {'user.uid': userId}, {'$push': {names: name}});
  },
  insert: function(user) {
    return basic.insert('users', user);
  },
};

module.exports = {
  users: users
};