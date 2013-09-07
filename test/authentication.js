var chai = require('chai')
chai.should()
var mongodb = require('mongodb')
var newApp = require('../app.js')
var newTime = require('../time.js')
var _ = require('underscore')
var Q = require('q')

describe('setup', function() {
  var database;
  var app;
  var time;
  var facebook;
  var session;

  before(function(done) {
    
    function withDatabase(callback) {
      var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect("mongodb://localhost:27017", function(err, db) {
        if (err) return console.warn('Failed to connect to database.', err);
        callback(db);
      });
    }
    withDatabase(function(db) {
      database = db
      done()
    })
  })

  beforeEach(function() {
    time = newTime()
    facebook = { getUserAndFriends: function(err, next) {
      next(null, {
        id: '12345'
      })
    }}
    session = { get: function() { return 'dummy-token' }}
    app = newApp(database, time, facebook, session)
  })

  afterEach(function(done) {
    database.collection('reports').drop(function() {
      done()
    })
  })

  after(function() {
    database.close()
  })


  describe('date is 2013-09-03', function() {
    beforeEach(function() {
      time.override(new Date('2013-09-03'))
    })

    xdescribe('we load overview', function() {
      var overview;
      beforeEach(function(done) {
        app.overview(function(err, result) {
          overview = result;
          done()
        })
      })

      it('should yield 21 days', function() {
        overview.days.length.should.equal(21)
      })

      it('yields 2013-09-03 as first day', function() {
        overview.days[0].heading.should.equal('TUE 03')
      })

      it('yields 2013-09-04 as second day', function() {
        overview.days[1].heading.should.equal('WED 04')
      })

      it('yields 2013-09-05 as third day', function() {
        overview.days[2].heading.should.equal('THU 05')
      })

      it('yields 2013-09-06 as fourth day', function() {
        overview.days[3].heading.should.equal('FRI 06')
      })

      it('yields 2013-09-07 as fifth day', function() {
        overview.days[4].heading.should.equal('SAT 07')
      })

      it('yields 2013-09-08 as sixth day', function() {
        overview.days[5].heading.should.equal('SUN 08')
      })

      it('yields 2013-09-23 as 21st day', function() {
        overview.days[20].heading.should.equal('MON 23')
      })

    })

    xdescribe('we have a single evening report', function() {
      beforeEach(function(done) {
        database.collection('reports').insert({
          user_id: '712821789127',
          availability: 'free',
          date: '2013-09-08',
          segment: 'evening'
        }, function(err, result) {
          done()
        })

        session.get = function fakeSessionGet(key) {
          if (key === 'facebook_token') return '!secret'
          throw new Error('Tried to get ' + key)
        }

        facebook.getUserAndFriends = function fakeGetUser(token, next) {
          if (token != '!secret') throw new Error('token was incorrect')
          next(null, {
            id: '712821789127',
            first_name: 'Mattias',
            picture: 'http://facebook.com/best_people_images/mattias.jpg'
          })
        }

      })

      describe('we load overview', function() {
        var overview;
        var person;
        beforeEach(function(done) {
          app.overview(function(err, result) {
            overview = result;
            person = overview.days[5].segments.evening.persons[0];
            done()
          })
        })

        it('displays the user picture', function() {
          person.imageSrc.should.equal('http://facebook.com/best_people_images/mattias.jpg')
        })

        it('displays the user header', function() {
          person.label.should.equal(
            '*Mattias* is **free** during *evening* this *Sunday*') 
        })

      })  

    })

    


    xdescribe('single report (evening, saturday)', function() {
      macroSetup({
        reports: [{
          user_id: '4327837298378429',
          availability: 'free',
          date: '2013-09-07',
          segment: 'evening'
        }],
        userAndFriends: {
          id: '4327837298378429',
          first_name: 'Nisse',
          picture: 'http://notrelvant.com/image.png'
        }
      }, function(context) {

        it('displays the user header', function() {
          var person = context.overview.days[4].segments.evening.persons[0]
          person.label.should.equal(
            '*Nisse* is **free** during *evening* this *Saturday*') 
        })
      })
    })


    xdescribe('single report (daytime, sunday)', function() {
      macroSetup({
        reports: [{
          user_id: '63278723892032198',
          availability: 'free',
          date: '2013-09-08',
          segment: 'daytime'
        }],
        userAndFriends: {
          id: '63278723892032198',
          first_name: 'Rolf',
          picture: 'http://facebook.com/lesser_people/rolf.jpg'
        }
      }, function(context) {

        it('displays the user header', function() {
          var person = context.overview.days[5].segments.daytime.persons[0]
          person.label.should.equal(
            '*Rolf* is **free** during *daytime* this *Sunday*') 
        })
      })
    })

    xdescribe('single report (daytime, monday)', function() {
      macroSetup({
        reports: [{
          user_id: '63278723892032198',
          availability: 'free',
          date: '2013-09-09',
          segment: 'daytime'
        }],
        userAndFriends: {
          id: '63278723892032198',
          first_name: 'Rolf',
          picture: 'http://facebook.com/lesser_people/rolf.jpg'
        }
      }, function(context) {
        it('displays the user picture', function() {
          var person = context.overview.days[6].segments.daytime.persons[0]
          person.imageSrc.should.equal('http://facebook.com/lesser_people/rolf.jpg')
        })

        it('displays the user header', function() {
          var person = context.overview.days[6].segments.daytime.persons[0]
          person.label.should.equal(
            '*Rolf* is **free** during *daytime* this *Monday*') 
        })
      })
    })

    function macroSetup(context, afterRun) {
      if (!context.reports) throw new Error('reports missing')
      if (!context.userAndFriends) throw new Error('userAndFriends missing')
      if (!afterRun) throw new Error('afterRun was not provided')
      beforeEach(function(done) {
        database.collection('reports').insert(context.reports, function(err, result) {
          done()
        })

        var fake_token = Math.floor((Math.random()*1000))
        session.get = function fakeSessionGet(key) {
          if (key === 'facebook_token') return fake_token
          throw new Error('Tried to get ' + key)
        }

        facebook.getUserAndFriends = function fakeGetUser(token, next) {
          if (token != fake_token) throw new Error('token was incorrect')
          next(null, context.userAndFriends)
        }

      })

      describe('run', function() {
        beforeEach(function(done) {
          app.overview(function(err, result) {
            context.overview = result
            done()
          })
        })
        afterRun(context)
      })
    }

    
  })
})

describe('test runner 2', function() {

  describe('single report 3 (daytime, monday)', function() {
    
    var context = singlePersonSingleReportContext('2013-09-09')
    beforeEach(context.run)

    it('displays the user picture', function() {
      context.renderedPerson.imageSrc
        .should.equal('http://facebook.com/lesser_people/rolf.jpg')
    })

    it('displays the user header', function() {
      context.renderedPerson.label
        .should.equal('*Rolf* is **free** during *daytime* this *Monday*') 
    })
  })

  // Single person with single report on dateString date
  function singlePersonSingleReportContext(dateString) {
    var me = facebookTokenContext()
    me.config.timeOverride = new Date(Date.parse(dateString))
    me.config.reports = [{
      user_id: '63278723892032198',
      availability: 'free',
      date: dateString,
      segment: 'daytime'
    }]
    me.config.userAndFriends = {
      id: '63278723892032198',
      first_name: 'Rolf',
      picture: 'http://facebook.com/lesser_people/rolf.jpg'
    }
    me.afterRun = function() {
      me.renderedPerson = 
        me.yield.days[0].segments.daytime.persons[0]
    }
    return me
  }

  function facebookTokenContext() {
    var me = overviewContextBase()
    me.config.sessionData = {
      facebook_token: '' + Math.floor(Math.random()*1000000)
    }

    return me
  }

  function overviewContextBase() {
    var me = {}

    var mongo = require('mongodb').MongoClient

    me.config = {}
    me.yield = null

    me.afterRun = function() {}

    me.run = function(next) {

      if (!next)  throw new Error('callback was not defined')
      if (!me.config.reports)         throw new Error('reports missing')
      if (!me.config.userAndFriends)  throw new Error('userAndFriends missing')
      if (!me.config.timeOverride)    throw new Error('timeOverride missing')
        
      var connected = connect(mongo, "mongodb://localhost:27017")

      var cleaned = connected
        .then(collectionGetter('reports'))
        .then(wipeCollection)
        .thenResolve(connected)

      var populated = cleaned
          .then(collectionGetter('reports'))
          .then(collectionInserter(me.config.reports))
          .thenResolve(connected)

      populated.then(function(connection) {

        var time = newTime()
        time.override(me.config.timeOverride)

        var facebook = {
          getUserAndFriends: function fakeGetUser(token, next) {
            if (token != me.config.sessionData['facebook_token']) 
              throw new Error('token was incorrect')
            next(null, me.config.userAndFriends)
          }
        }
        
        var session = {
          get: function fakeSessionGet(key) {
            if (key === 'facebook_token') 
              return me.config.sessionData['facebook_token']
            throw new Error('Tried to get ' + key)
          }
        }
            
        return Q.ninvoke(newApp(connection, time, facebook, session), 'overview')
      })
      .then(function(overviewData) {
        me.yield = overviewData
        me.afterRun()
        next()
      })
      .fail(next)
      .done()  
    }

    return me
  }

})

var connect = function(client, uri) {
  return Q.ninvoke(client, 'connect', uri)
}

var collectionGetter = function(name) {
  return function(conn) {
    return conn.collection(name)
  }
}

var collectionInserter = function(documents) {
  return function(coll) {
    Q.ninvoke(coll, 'insert', documents, { safe:true })
  }
}

var wipeCollection = function(coll) {
  return Q.ninvoke(coll, 'drop')  
}

