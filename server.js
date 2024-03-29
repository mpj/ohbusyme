var connect = require('connect')
  , http = require('http')
  , fs = require('fs')
  , mongodb = require('mongodb')
  , ObjectID = mongodb.ObjectID
  , _ = require('underscore')
  , graph = require('fbgraph')
  , Q = require('q')
  , faye = require('faye')
  , raven =  require('raven')
  , keen = require("keen.io")
  , less = require('connect-lesscss')


var keen = keen.configure({
    projectId: "523230f000111c0a2f000006",
    writeKey: "5c6d4d0d55c95180809887854ea17d667b07192aba6245d2b6a6eb14362e42c21e1b8728452e09f6bb6732ed9b74186f96df7a1a6112be4144c60f0e2290806385ce5258cab00eb6af6acd434fe914d6f3eb5878e220d1a2da557687c77f47cdda1e45d0090f987084536c29ed22cc11"
});


Q.longStackSupport = true;

var cacheAge = 0;
if (process.env.NODE_ENV === 'production') {
  cacheAge = 60 * 60 * 1000;
}


var redirect = require('connect-redirection');
var auth = require('connect-auth');
var urlrouter = require('urlrouter');

var newApp = require('./app')

var QStore = require('./q-store-mongo')
var mongoConnectionP = QStore.connect(process.env.MONGOHQ_URL || "mongodb://localhost:27017")

var timeService = {
  get: function() {
    return new Date()
  }
}

function tinyCache(maxSize) {
  var cache = {};
  var keys = [];
  return function(key, value) {
    if(!value) return cache[key];
    if(keys.push(key) > maxSize) cache[keys.shift()] = null;
    return cache[key] = value;
  }
}

var userServiceCache = tinyCache(10000)
var userService = {
  get: function(token) {

    if(userServiceCache(token)) return Q(userServiceCache(token))
    
    // convert fb user to OBM user.
    function toSimpleUser(fbUser) {
      var su = {
        id:         fbUser.id,
        first_name: fbUser.first_name,
        // TODO: Deliver pictures with varying sizes
        picture:    'http://graph.facebook.com/' + fbUser.id + '/picture?width=300&amp;height=300'
      }
      return su
    }

    // recursive get of friends
    function getAllFriends(friendData, arr) {
      if (!friendData.data) 
        throw new Error("Expected friendData to have data property")
      arr = arr.concat(friendData.data.map(toSimpleUser))
      if(friendData.paging && friendData.paging.next) {
        var nextPath = 
          friendData.paging.next
            .replace('https://','')
            .replace('http://','')
            .replace('graph.facebook.com/', '')
        return Q.ninvoke(graph, 'get', nextPath)
          .then(function(friendData) {
            return getAllFriends(friendData, arr)
          })
      } else {
        return Q(arr)
      }
    }

    var uri = 'me?fields=id,first_name,friends.fields(id,first_name)';
    graph.setAccessToken(token);
    return Q.ninvoke(graph, 'get', uri).then(function(user) {
      return getAllFriends(user.friends, []).then(function(allFriends) {
        var currentUser = toSimpleUser(user)
        currentUser.friends = allFriends
        userServiceCache(token, currentUser)
        return Q(currentUser)
      })
    }).fail(function(err) {
      // Convert facebook errors to real node errors
      // so that node will display and catch it properly
      var error = new Error(err.message)
      error.code = err.code
      throw error
    })
  }
}

var newSessionService = function(req) {
  
  if (!req) 
    throw new Error("newSessionService requires session")

  return {
    get: function(key) {
      return req.session[key]
    },
    set: function(key, value) {
      req.session[key] = value
    }
  }
}

var publishService = {
  trigger: function(channel, event, message) {
    bayeux.getClient().publish('/'+channel, {
      event:    event,
      message:  message
    });
    Q(true)
  }
}


var server = connect()
  .use(connect.favicon())
  .use(redirect())
  .use(connect.query())
  .use(connect.bodyParser())
  .use(connect.methodOverride())
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'keyboard hat' }))
  .use(auth([
      auth.Facebook({
          appId : process.env.FACEBOOK_APP_ID || "147631548776900", 
          appSecret: process.env.FACEBOOK_APP_SECRET || "bab09c8d595c7d9ab2e40622704d1130", 
          callback: process.env.FACEBOOK_CALLBACK || "http://localhost:3000/facebook-auth"
      })
  ]))
  .use(connect.compress()) // must be before static
  .use(connect.static('public', { maxAge: cacheAge }))
  .use(connect.static('node_modules', { maxAge: cacheAge }))
  .use("/app.css", less("less/app.less", {
//    paths: ["path/to/other/less/files"]
  }))

  

  .use(urlrouter(function(r) {
    
    r.get('/', function(req, res, next) {
      keen.addEvent("navigation", {"target": "landing"})
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('landing.html'));    
    }) 

    r.get(/\/facebook-auth.*/, function(req, res, next) {
      req.authenticate("facebook", function(error, authenticated) {
        if(error) return next(error);
        if (authenticated) {
          // Setting session token to something more sane
          // https://github.com/ciaranj/connect-auth/issues/65s
          var sess = newSessionService(req)
          sess.set('facebook_token', req.session.access_token)
          keen.addEvent("navigation", {"target": "login-successful"})
          res.redirect("/app");
        }
      });
    })

    r.get(/\/press\/segment\/.*/, function(req, res, next) {

      keen.addEvent("navigation", {"target": "segment-press"})

      var parts = req.url.split('/')
      var dateStr = parts[3]
      var segmentName = parts[4]

      var sess = newSessionService(req)
      mongoConnectionP.then(function(mongoConnection) {
        var deferred = Q.defer()
        var app = newApp(
          mongoConnection, timeService, userService, sess, publishService)
        var obj = app.press(segmentName, dateStr, function(err, result) {
          if (err)  deferred.reject(err)
          else      deferred.resolve(result)
        })
        return deferred.promise
      }).then(function(result) {
        res.writeHead(200);
        res.end(); 
      }).fail(function(error) {
        var isTokenInvalid = error.code === 2500
        if(isTokenInvalid) {
          res.writeHead(403);
          res.end(); 
        } else {
          throw error
        }
      }).done()
    })

    r.get('/app', function(req, res, next) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('app.html')); 
    })

    r.get('/overview.json', function(req, res, next) {

      var sess = newSessionService(req)

      mongoConnectionP.then(function(mongoConnection) {
        var app = newApp(
          mongoConnection, timeService, userService, sess, publishService)
        var deferred = Q.defer();
        app.overview(function(err, result) {
          if (err)  deferred.reject(err)
          else      deferred.resolve(result)
        })
        return deferred.promise
      }).then(function(result) {
        var json = JSON.stringify(result);
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.end(json); 
      }).fail(function(error) {
        var isTokenInvalid = error.code === 2500
        if(isTokenInvalid) {
          res.writeHead(403);
          res.end(); 
        } else {
          throw error
        }
      }).done()

    })

  }))
  .use(raven.middleware.connect(process.env.SENTRY_DSN)) 



var server = http.createServer(server)
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(server)


var port = process.env.PORT || 3000;
server.listen(port);
console.log("Listening on port", port)





