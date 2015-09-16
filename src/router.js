var express = require('express');
var router = express.Router();
var companyRepositoryFactory = require('./repository/companyRepository');
var companyRepository;

var customRouter = {};
customRouter.create = function (logger) {
  companyRepository = companyRepositoryFactory.create(logger);

  // middleware specific to this router
  router.use(function timeLog(req, res, next) {
    logger.info(req.connection.remoteAddress + ' req.url: ' + req.url);
    next();
  });

  // define route
  router.get('/companies', function(req, res) {
    companyRepository.get()
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err){
      logger.error('Error: ' + err);
    });
  });

  // define sample route
  router.get('/about', function(req, res) {
    res.send('About birds');
  });
  return router;
}

module.exports = customRouter;