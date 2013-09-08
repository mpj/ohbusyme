var mongodb = require('mongodb')
var Q = require('q')

// Ultra-thin facade around mongodb to get 
// rid of hard mongo dependency and 
// to "promisify" mongo.
var QStoreMongo = {
  connect: function(uri) {
    return Q.ninvoke(mongodb.MongoClient, 'connect', uri)
  }, 
  collection: function(name) {
    return function(connection) { return connection.collection(name) }
  },
  find: function(selector) {
    return function(collection) { 
      var cursor = collection.find(selector)
      return Q.ninvoke(cursor, 'toArray') 
    }
  },
  insert: function(documents) {
    return function(coll) {
      Q.ninvoke(coll, 'insert', documents, { safe:true })
    }
  },
  clear: function(collection) {
    // Using remove here because drop 
    // were causing "ns not found" and various
    // other funky things.
    return Q.ninvoke(collection, 'remove')
  }
}

module.exports = QStoreMongo