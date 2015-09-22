var express = require('express');
var formidable = require("formidable"); // for parse post request with form-data
var router = express.Router();
var companyRepositoryFactory = require('./repository/companyRepository');
var companyRepository;

var customRouter = {};
customRouter.create = function (logger) {
  companyRepository = companyRepositoryFactory.init(logger);

  // middleware specific to this router
  router.use(function timeLog(req, res, next) {
    logger.info(req.connection.remoteAddress + ' req.originalUrl: ' + req.originalUrl);
    next();
  });

  // define route
  router.get('/companies/:prefix?', function(req, res) {
    var schemePrefix = null;

    if(req.params.prefix) {
      schemePrefix = req.params.prefix.toUpperCase();
    }

    companyRepository.get(schemePrefix)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err){
      logger.error('Error: ' + err);
    });
  });

  // define route
  router.post('/companies/versions', function(req, res) {
    logger.info(JSON.stringify(req.body));
    var data = req.body;

    // server validate
    if(data.prefix && typeof data.prefix === 'string') {
      if(data.version && typeof data.version === 'object') {
        if(data.version.configurator && data.version.service && data.version.status) {
          if(typeof data.version.configurator === 'number' && typeof data.version.service === 'number' && typeof data.version.status === 'string') {
            companyRepository.addVersion(data.prefix, data.version)
                .then(function (result) {
                  res.sendStatus(200);
                })
                .catch(function (err) {
                  logger.error('Error: ' + err);
                  res.sendStatus(500);
                });
          }
          else {
            logger.error('Error, version.configurator or version.service or data.version.status is not correct: ' + data);
            res.sendStatus(500);
          }
        }
        else {
          logger.error('Error, version.configurator or version.service or data.version.status not defined: ' + data);
          res.sendStatus(500);
        }
      }
      else {
        logger.error('Error, version is not defined or not correct type: ' + data);
        res.sendStatus(500);
      }
    }
    else {
      logger.error('Error, prefix is not defined or not correct type: ' + data);
      res.sendStatus(500);
    }
    /*var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      logger.info(typeof fields);
      logger.info(JSON.stringify(fields));
      res.sendStatus(200);
    });*/
  });

  return router;
}

module.exports = customRouter;