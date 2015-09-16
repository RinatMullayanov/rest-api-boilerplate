var express = require('express');
var compress = require('compression'); // gzip
var cors = require('cors'); // CORS
var app = express();

var config = require('./config');
var router = require('./router');

var winston = require('winston'); // logger
var path = require('path');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'api.log',
      timestamp: function () {
        'use strict';
        return new Date().toLocaleString();
      }
    })
  ]
});

// Access-Control-Allow-Origin: *
app.use(cors({
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept']
})); 
logger.info('CORS enabled.');

// enable gzip for static
app.use(compress({
  threshold: 512
}));
logger.info('Gzip is enabled.');

// hide information
app.disable('x-powered-by');

app.use(router.create(logger));

// listen
app.listen(config.port, function () {
  logger.transports.console.level = 'info';

  // setting run status: development or production
  if (config.status === 'dev') {
    logger.info('Server start like [DEV]');
  } else if (config.status === 'production') {
    logger.info('Server start like [PRODUCTION]');
  } else {
    config.status = 'production';
    logger.warn('Server status not defined! Server start like [PRODUCTION]');
  }

  logger.info('Server start is listening port: ' + config.port);
  if (config.status === 'production') {
    // less logger level
    logger.transports.console.level = 'error';
  }
});

