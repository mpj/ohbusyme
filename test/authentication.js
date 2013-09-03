var chai = require('chai')
chai.should()
var mongodb = require('mongodb')
var newApp = require('../app.js')
var newTime = require('../time.js')

describe('setup', function() {
	var database;
	var app;
	var time;

	beforeEach(function(done) {
		withDatabase(function(db) {
			database = db
			time = newTime()
			app = newApp(database, time)
			done()
		})
	})

	describe('we have a single availability', function() {
		beforeEach(function(done) {
			database.collection('availabilities').insert({
				fb_user_id: '712821789127',
				availability: 'free',
				date: '2013-01-03',
				segment: 'evening'
			}, function(err, result) {
				done()
			})
		})

		describe('date is 2013-09-03', function() {
			beforeEach(function() {
				time.override(new Date('2013-09-03'))
			})

			describe('we load overview', function() {
				var overview;
				beforeEach(function() {
					app.overview(function(err, result) {
						overview = result;
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

				it('yields 2013-09-24 as 21st day', function() {
					overview.days[20].heading.should.equal('TUE 24')
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