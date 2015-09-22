var Promise = require("bluebird");
var MongoDB = require("mongodb");
Promise.promisifyAll(MongoDB);

var MongoClient = MongoDB.MongoClient;
var assert = require('assert');

// Connection URL
var url = 'mongodb://forbuilds:27017/wikiRep';
var collectionName = 'company';

var companyRepository = {
  init: init
};

var logger = {
  info: function() {},
  error: function() {}
};

function init(curLogger) {
  logger = curLogger;
  return {    
    get: get,
    addVersion: addVersion
  }
}

function get(prefix) {
  var _db;
  return MongoClient.connectAsync(url)
    .then(function(db) {
      logger.info("Request list of company.");
      _db = db;
      var result;
      if(prefix) {
        result = db.collection(collectionName).find({ schemePrefix: prefix}).sort({name: 1}).toArrayAsync();
      } 
      else {
        result = db.collection(collectionName).find({}).sort({name: 1}).toArrayAsync();
      }

      return result;
    })
    .catch(function(err) {
      // An error occurred
      logger.error('Error: ' + err);
    })
    .finally(function() {
      _db.close();
      logger.info('Close MongoDB connection!');
    });
}

function addVersion(prefix, version) {
  return _removeStatus(prefix, version.status).
    then(function(result) {
      return _addVersion(prefix, version);
    });
}

function _removeStatus(prefix, status) {
  var _db;
  return MongoClient.connectAsync(url)
    .then(function(db) {
      logger.info("Connected correctly to server");
      _db = db;

      var collection = db.collection(collectionName);
      return collection
        .findOneAsync({ schemePrefix: prefix})
          .then(function(doc) {
            var versions = doc.tmLoaderVersion;
            for (var i = 0; i < versions.length; i++) {
              var element = versions[i];
              if(element.status) {
                if(element.status === status) {
                  delete element.status;
                }
              }
            }

            return collection.saveAsync(doc, {w: 1});
          });
  })
  .catch(function(err) {
    // An error occurred
    logger.error('Error: ' + err);
  })
  .finally(function() {
    _db.close();
    logger.info('Close MongoDB connection!');
  }); 
}

function _addVersion(prefix, version) {
  var _db;
  
  return MongoClient.connectAsync(url)
    .then(function(db) {
      logger.info("Connected correctly to server");
      _db = db;
      // filter, update obj
      var result = db.collection(collectionName).updateOneAsync({ schemePrefix: prefix}, {$push: {tmLoaderVersion: version}}, { upsert: true });
      return result;
    })
    .catch(function(err) {
      // An error occurred
      logger.error('Error: ' + err);
    })
    .finally(function() {
      _db.close();
      logger.info('Close MongoDB connection!');
    }); 
}

module.exports = companyRepository;