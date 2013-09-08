var chai = require('chai')
chai.should()
var mongodb = require('mongodb')
var newApp = require('../app.js')
var newTime = require('../time.js')
var _ = require('underscore')
var Q = require('q')

describe('test runner 2', function() {

  describe('Lists day spans', function() {
    
    var context = singleReportContext({
      date: '2013-09-03',   segment: 'daytime',
      name: 'Irrelevant',   availability: 'free'
    })
    beforeEach(context.run)

    it('should yield 21 days', function() {
      context.yield.days.length.should.equal(21)
    })

    it('yields 2013-09-03 as first day', function() {
      context.yield.days[0].heading.should.equal('TUE 03')
    })

    it('yields 2013-09-04 as second day', function() {
      context.yield.days[1].heading.should.equal('WED 04')
    })

    it('yields 2013-09-05 as third day', function() {
      context.yield.days[2].heading.should.equal('THU 05')
    })

    it('yields 2013-09-06 as fourth day', function() {
      context.yield.days[3].heading.should.equal('FRI 06')
    })

    it('yields 2013-09-07 as fifth day', function() {
      context.yield.days[4].heading.should.equal('SAT 07')
    })

    it('yields 2013-09-08 as sixth day', function() {
      context.yield.days[5].heading.should.equal('SUN 08')
    })

    it('yields 2013-09-23 as 21st day', function() {
      context.yield.days[20].heading.should.equal('MON 23')
    })

  })

  describe('Sunday', function() {
    
    var context = singleReportContext({
      date: '2013-09-08',   segment: 'daytime',
      name: 'Hank',         availability: 'free'
    })
    beforeEach(context.run)

    it('displays the user picture', function() {
      context.renderedPerson.imageSrc
        .should.equal(context.config.userAndFriends.picture)
    })

    it('displays the user label', function() {
      context.renderedPerson.label
        .should.equal('*Hank* is **free** during *daytime* this *Sunday*') 
    })

  })

  describe('Sunday', function() {
    
    var context = singleReportContext({
      date: '2013-09-08',   segment: 'daytime',
      name: 'Hank',         availability: 'free'
    })
    beforeEach(context.run)

    it('displays the user picture', function() {
      context.renderedPerson.imageSrc
        .should.equal(context.config.userAndFriends.picture)
    })

    it('displays the user label', function() {
      context.renderedPerson.label
        .should.equal('*Hank* is **free** during *daytime* this *Sunday*') 
    })

  })


  describe('Monday', function() {
    var context = singleReportContext({
      date: '2013-09-09',   segment: 'daytime',
      name: 'Wayne',         availability: 'free'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Wayne* is **free** during *daytime* this *Monday*') 
    })
  })

  describe('Tuesday', function() {
    var context = singleReportContext({
      date: '2013-09-10',   segment: 'daytime',
      name: 'Lina',         availability: 'unknown'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Lina* is **unknown** during *daytime* this *Tuesday*') 
    })
  })

  describe('Wednesday', function() {
    var context = singleReportContext({
      date: '2013-09-11',   segment: 'evening',
      name: 'Martha',       availability: 'free'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Martha* is **free** during *evening* this *Wednesday*') 
    })
  })


  describe('Thursday', function() {
    var context = singleReportContext({
      date: '2013-09-12', segment: 'evening',
      name: 'Johanna',       availability: 'unknown'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Johanna* is **unknown** during *evening* this *Thursday*') 
    })
  })

  describe('Friday', function() {
    var context = singleReportContext({
      date: '2013-09-13', segment: 'evening',
      name: 'Johanna',       availability: 'unknown'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Johanna* is **unknown** during *evening* this *Friday*') 
    })
  })

  describe('Saturday', function() {
    var context = singleReportContext({
      date: '2013-09-14', segment: 'evening',
      name: 'Rolf',       availability: 'free'
    })
    beforeEach(context.run)

    it('displays correct person label', function() {
      context.renderedPerson.label
        .should.equal('*Rolf* is **free** during *evening* this *Saturday*') 
    })
  })


  function singleReportContext(opts) {

    var me = facebookTokenContext()
    me.config.timeOverride = new Date(Date.parse(opts.date))
    me.config.reports = [{
      user_id: '63278723892032198',
      availability: opts.availability,
      date: opts.date,
      segment: opts.segment
    }]
    me.config.userAndFriends = {
      id: '63278723892032198',
      first_name: opts.name,
      picture: 'http://facebook.com/lesser_people/rolf.jpg'
    }
    me.afterRun = function() {
      
      me.renderedPerson = 
        me.yield.days[0].segments[opts.segment].persons[0];
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

      return me
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

