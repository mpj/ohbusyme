var chai = require('chai')
chai.should()
var mongodb = require('mongodb')
var newApp = require('../app.js')
var newTime = require('../time.js')

describe('setup', function() {
  var database;
  var app;
  var time;
  var facebook;
  var session;

  beforeEach(function(done) {
    withDatabase(function(db) {
      database = db
      time = newTime()
      facebook = { getUserAndFriends: function(err, next) {
        next(null, {
          id: '12345'
        })
      }}
      session = { get: function() { return 'dummy-token' }}
      app = newApp(database, time, facebook, session)
      database.collection('reports').drop()
      done()
    })
  })


  describe('date is 2013-09-03', function() {
    beforeEach(function() {
      time.override(new Date('2013-09-03'))
    })

    describe('we load overview', function() {
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

    describe('we have a single evening report', function() {
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

    describe('we have a single daytime report', function() { 
      beforeEach(function(done) {
        database.collection('reports').insert({
          user_id: '63278723892032198',
          availability: 'free',
          date: '2013-09-08',
          segment: 'daytime'
        }, function(err, result) {
          done()
        })

        session.get = function fakeSessionGet(key) {
          if (key === 'facebook_token') return '!ninjasareawesome'
          throw new Error('Tried to get ' + key)
        }

        facebook.getUserAndFriends = function fakeGetUser(token, next) {
          if (token != '!ninjasareawesome') throw new Error('token was incorrect')
          next(null, {
            id: '63278723892032198',
            first_name: 'Rolf',
            picture: 'http://facebook.com/lesser_people/rolf.jpg'
          })
        }

      })

      describe('we load overview', function() {
        var overview;
        var person;
        beforeEach(function(done) {
          app.overview(function(err, result) {
            overview = result;
            person = overview.days[5].segments.daytime.persons[0];
            done()
          })
        })

        it('displays the user picture', function() {
          person.imageSrc.should.equal('http://facebook.com/lesser_people/rolf.jpg')
        })

        it('displays the user header', function() {
          person.label.should.equal(
            '*Rolf* is **free** during *daytime* this *Sunday*') 
        })

      })

    })

    describe('we have a single daytime report (monday)', function() { 
      beforeEach(function(done) {
        database.collection('reports').insert({
          user_id: '63278723892032198',
          availability: 'free',
          date: '2013-09-09',
          segment: 'daytime'
        }, function(err, result) {
          done()
        })

        session.get = function fakeSessionGet(key) {
          if (key === 'facebook_token') return '!ninjasareawesome'
          throw new Error('Tried to get ' + key)
        }

        facebook.getUserAndFriends = function fakeGetUser(token, next) {
          if (token != '!ninjasareawesome') throw new Error('token was incorrect')
          next(null, {
            id: '63278723892032198',
            first_name: 'Rolf',
            picture: 'http://facebook.com/lesser_people/rolf.jpg'
          })
        }

      })

      describe('we load overview', function() {
        var overview;
        var person;
        beforeEach(function(done) {
          app.overview(function(err, result) {
            overview = result;
            person = overview.days[6].segments.daytime.persons[0];
            done()
          })
        })

        it('displays the user picture', function() {
          person.imageSrc.should.equal('http://facebook.com/lesser_people/rolf.jpg')
        })

        it('displays the user header', function() {
          person.label.should.equal(
            '*Rolf* is **free** during *daytime* this *Monday*') 
        })

      })

    })

  })

})


function withDatabase(callback) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017", function(err, db) {
    if (err) return console.warn('Failed to connect to database.');
    callback(db);
  });
}