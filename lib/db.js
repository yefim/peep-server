var Promise = require('bluebird');
var mongoskin = require('mongoskin');
var mongoDb = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/peep';
var db = mongoskin.db(mongoDb, {safe: true});
db.bind('users');

// Promisify all that is mongoskin
Object.keys(mongoskin).forEach(function(key) {
  var value = mongoskin[key];
  if (typeof value === "function") {
    Promise.promisifyAll(value);
    Promise.promisifyAll(value.prototype);
  }
});
Promise.promisifyAll(mongoskin);

var basic = {
  findOne: function(collection, fields) {
    return db[collection].findOneAsync(fields);
  },
  insert: function(collection, obj) {
    return db[collection].insertAsync(obj);
  },
  update: function(collection, fields, options) {
    return db[collection].updateAsync(fields, options);
  }
};

/* User Schema
 * {
 *   user: {
 *     uid,
 *     number,
 *     token,
 *     contacts: [
 *       {
 *         name,
 *         number
 *       }
 *     ]
 *   },
 *   names: [
 *     {
 *       name,
 *       uid
 *     }
 *   ]
 * }
 */
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

/*
 * Chat Schema
 * {
 *   uid,
 *   name,
 *   members: [ uid ],
 *   messages: [
 *     {
 *       sender,
 *       content
 *     }
 *   ],
 * }
 */

module.exports = {
  users: users
};
