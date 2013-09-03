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


var redirect = require('connect-redirection');
var auth = require('connect-auth');
var urlrouter = require('urlrouter');

var app = connect()
  .use(connect.favicon())
  .use(redirect())
  .use(connect.query())
  .use(connect.bodyParser())
  .use(connect.methodOverride())
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'keyboard cat' }))
  .use(auth([
      auth.Facebook({
          appId : "147631548776900", 
          appSecret: "bab09c8d595c7d9ab2e40622704d1130", 
          callback: "http://localhost:3000/facebook-auth"
      })
  ]))
  .use(connect.compress()) // must be before static
  .use(connect.static('public', { maxAge: cacheAge }))
  .use(connect.static('node_modules', { maxAge: cacheAge }))
  

  .use(urlrouter(function(r) {
    
    r.get('/', function(req, res, next) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('landing.html'));    
    }) 

    r.get(/\/facebook-auth.*/, function(req, res, next) {
      req.authenticate("facebook", function(error, authenticated) {
        if (authenticated) res.redirect("/app");
      });
    })

    r.get('/app', function(req, res, next) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('app.html')); 
    })

    r.get('/overview.json', function(req, res, next) {
      var obj = {
        days: [{
          label: 'MÅN 02',
          segments: {
            daytime: {
              id: 'segment123',
              label: "Dagtid",
              persons: [{
                imageSrc: '/images/test/louise.jpg',
                look: 'unknown',
                label: '*You* are **free** during *daytime* this *Poop*'
              }]
            },
            evening: {
              id: 'segment456',
              label: "Kvällstid",
              persons: [{
                imageSrc: '/images/test/louise.jpg',
                look: 'unknown',
                label: '*You* are **unknown** during *evening* this *Poop*'
              }]
            }
          }
        }]
      }
      var json = JSON.stringify(obj);
      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.end(json); 
    })

  }));


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.log("Listening on port", port)