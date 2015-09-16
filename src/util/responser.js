var responser = exports;

responser.badRequest  = function(response, logger) {
  responser.addAllowResponse(response, logger);
  logger.info('[400] Bad Request');
  response.statusCode = 400;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end("400 Bad Request.");
};

responser.notFound = function(response, logger) {
  logger.info('[404] Not Found');
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end("404 Not found.");
};

responser.text = function(response, text, logger) {
  logger.info('textResponse');
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end(text);
};

responser.html = function(response, html, logger) {
  logger.info('htmlResponse');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(html);
};

responser.json = function(response, object, logger) {
  logger.info('json');
  //  writeHead send immediately, setHeader send with nearest sending
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  var json = JSON.stringify(object);
  response.end(json);
};

//http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
responser.addAllowResponse = function(response, logger) {
  logger.info('addAllowResponse');
  // Website you wish to allow to connect
  // instead of * better use real address
  response.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // true don't work with Access-Control-Allow-Origin: * - you must specify the domain explicitly 
  response.setHeader('Access-Control-Allow-Credentials', 'false'); // NO send cookie with enable CORS
  // Request headers you wish to allow
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

responser.jsonCors = function(response, object, logger) {
  responser.addAllowResponse(response, logger);
  responser.json(response, object, logger);
};

// http://stackoverflow.com/questions/12240274/how-to-set-cookie-value-in-node-js
responser.setCookie = function(response, session_id, logger) {
  logger.info('setCookieResponse');

    var cookie = 'session_id=' + session_id;
  // http://mrcoles.com/blog/cookies-max-age-vs-expires/
  // set expires 9 seconds
  //Expires sets an expiry date for when a cookie gets deleted
  //Max-age sets the time in seconds for when a cookie will be deleted
  //Internet Explorer (ie6, ie7, and ie8) does not support “max-age”, while (mostly) all browsers support expires

  // new Date(time in ms)
  cookie += ';expires=' + new Date(new Date().getTime() + 3600000).toUTCString();
  cookie += ';max-age=' + 3600; // seconds

  //cookie += ';httpOnly'; // make cookie unavailable for client javascript
  logger.info('cookie: ' + cookie);

  response.setHeader("Set-Cookie", cookie);
};

responser.jsonCorsCookie = function(response, session_id, object, logger) {
  logger.info('jsonCorsCookie');

  responser.setCookie(response, session_id, logger);
  responser.jsonCors(response, object, logger);
};
