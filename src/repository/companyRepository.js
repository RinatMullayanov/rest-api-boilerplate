var Promise = require("bluebird");
var MongoDB = require("mongodb");
Promise.promisifyAll(MongoDB);

var MongoClient = MongoDB.MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/wikiRep';
var collection = 'company';

var companyRepository = {
  create: create
};

var logger;
function create(curLogger) {
  logger = curLogger;
  return {    
    get: get,
    save: save
  }
}

function get(companyName) {
  var _db;
  return MongoClient.connectAsync(url)
    .then(function(db) {
      logger.info("Request list of company.");
      _db = db;
      var result;
      if(companyName) {
        result = db.collection(collection).find({ name: companyName}).toArrayAsync();
      } 
      else {
        result = db.collection(collection).find({}).toArrayAsync();
      }

      return result;
    })
    .catch(function(err) {
      // An error occurred
      logger.error('Error: ' + err);
    })
    .finally(function() {
      _db.close();
      logger.info('Close MongoDB connection.');
    });
}

function save(nameChatRoom, msg) {
  var _db;
  /*return MongoClient.connectAsync(url)
    .then(function(db) {
      logger.info("Connected correctly to server");
      _db = db;
      // filter, update obj
      var result = db.collection("chatrooms").updateOneAsync({ name: nameChatRoom}, {$push: {messages: msg}}, { upsert: true });
      return result;
    })
    .catch(function(err) {
      // An error occurred
      logger.error('Error: ' + err);
    })
    .finally(function() {
      _db.close();
      logger.info('close');
    });*/
}

module.exports = companyRepository;