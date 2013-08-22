var connect = require('connect')
  , http = require('http')
  , fs = require('fs')
  , mongodb = require('mongodb')
  , ObjectID = mongodb.ObjectID
  , _ = require('underscore')

var cacheAge = 0;
if (process.env.NODE_ENV === 'production') {
  cacheAge = 60 * 60 * 1000;
}

var app = connect()
  .use(connect.favicon())
  .use(connect.compress()) // must be before static
  .use(connect.static('public', { maxAge: cacheAge }))
  .use(connect.static('node_modules', { maxAge: cacheAge }))
  .use(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('index.html'));  
  });


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log("Listening on port", port)