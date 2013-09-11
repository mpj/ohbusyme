var chai = require('chai')
chai.should()
var newApp = require('../app.js')
var newTime = require('../time.js')
var _ = require('underscore')
var Q = require('q')
var QStore = require('../q-store-mongo')

describe('Lists day spans', function() {
  
  var context = singleReportContext({
    date: '2013-09-03',   segment: 'daytime',
    name: 'Irrelevant',   availability: 'free'
  })
  beforeEach(context.runOverview)

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

describe('Virtual segments (no reports) ', function() {
  
  var context = noReportsContext({
    name: 'Maja', date: '2012-01-01'
  })
  beforeEach(context.runOverview)

  it('should yield 21 days even though empty', function() {
    context.yield.days.length.should.equal(21)
  })

  it('yields 2012-01-01 as first day', function() {
    context.yield.days[0].heading.should.equal('SUN 01')
  })

  it('yields 2013-1-21 as 21st day', function() {
    context.yield.days[20].heading.should.equal('SAT 21')
  })

  it('yields the user a listed person on first day', function() {
    context.yield.days[0].segments.daytime.persons[0].label
      .should.include('Maja')
  })

  it('yields full label')

  it('person has the right appearance', function() {
    context.yield.days[0].segments.daytime.persons[0].appearance
      .should.equal('unknown')
  })
      

})

describe('Virtual segments (single report)', function() {
  
  var context = singleReportContext({
    date: '2013-09-08',   segment: 'daytime',
    name: 'Hank',         availability: 'free'
  })
  beforeEach(context.runOverview)

  it('should not add virtual element on reported segments', function() {
    context.yield.days[0].segments.daytime.persons.length
      .should.equal(1)

  })

  it('displays other segments as unknown', function() {
    context.yield.days[0].segments.evening.persons[0].appearance
      .should.equal('unknown')
  })

  it('displays other days as unknown', function() {
    context.yield.days[1].segments.evening.persons[0].appearance
      .should.equal('unknown')
  })

})


describe('Sunday', function() {
  
  var context = singleReportContext({
    date: '2013-09-08',   segment: 'daytime',
    name: 'Hank',         availability: 'free'
  })
  beforeEach(context.runOverview)

  it('displays the user picture', function() {
    context.renderedPerson.imageSrc
      .should.equal(context.config.userAndFriends.picture)
  })

  it('displays the user label', function() {
    context.renderedPerson.label
      .should.equal('*Hank* is **free** during *daytime* this *Sunday*') 
  })

  it('displays user availabilxity as appearance', function() {
    context.renderedPerson.appearance
      .should.equal('free')
  })

  it('displays other segments as unknown', function() {
    context.yield.days[0].segments.evening.persons[0].appearance
      .should.equal('unknown')
  })

  it('displays other days as unknown', function() {
    context.yield.days[1].segments.evening.persons[0].appearance
      .should.equal('unknown')
  })

})

describe('Monday', function() {
  var context = singleReportContext({
    date: '2013-09-09',   segment: 'daytime',
    name: 'Wayne',         availability: 'unknown'
  })
  beforeEach(context.runOverview)

  it('displays correct person label', function() {
    context.renderedPerson.label
      .should.equal('*Wayne* is **unknown** during *daytime* this *Monday*') 
  })

  it('displays user availability as appearance', function() {
    context.renderedPerson.appearance
      .should.equal('unknown')
  })
})

describe('Tuesday', function() {
  var context = singleReportContext({
    date: '2013-09-10',   segment: 'daytime',
    name: 'Lina',         availability: 'unknown'
  })
  beforeEach(context.runOverview)

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
  beforeEach(context.runOverview)

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
  beforeEach(context.runOverview)

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
  beforeEach(context.runOverview)

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
  beforeEach(context.runOverview)

  it('displays correct person label', function() {
    context.renderedPerson.label
      .should.equal('*Rolf* is **free** during *evening* this *Saturday*') 
  })
})

describe('Friend availability', function() {
  var context = friendReportContext({
    date: '2012-02-29', 
    segment: 'evening', name: 'John',   
    friendName: 'Samantha', availability: 'free'
  })
  beforeEach(context.runOverview)

  it('should have both the virtual element and the friend', function() {
    context.yield.days[0].segments.evening.persons.length
      .should.equal(2)
  })

  it('shows current user first, as unknown', function() {
    context.yield.days[0].segments.evening.persons[0].appearance
      .should.equal('unknown')
  })

  it('shows current user first, with label', function() {
    context.yield.days[0].segments.evening.persons[0].label
      .should.include('John')
  })

  it('shows friends next, as free', function() {
    context.yield.days[0].segments.evening.persons[1].appearance
      .should.equal('free')
  })

  it('shows friends next, with label', function() {
    context.yield.days[0].segments.evening.persons[1].label
      .should.include('Samantha')
  })
})

describe('Pressing own avatar (evening)', function() {
   var context = noReportsContext({
    name: 'Maja', date: '2012-01-01'
  })
  beforeEach(context.runPress('person', 
    context.config.userAndFriends.id, '2012-01-01', 'evening'))

  it('writes the report to the database (id)', function() {
    context.reportsInDatabase[0].user_id
      .should.equal(context.config.userAndFriends.id)
  })

  it('writes the report to the database (availability)', function() {
    context.reportsInDatabase[0].availability
      .should.equal('free')
  })

  it('writes the report to the database (date)', function() {
    context.reportsInDatabase[0].date
      .should.equal('2012-01-01')
  })

  it('writes the report to the database (segment)', function() {
    context.reportsInDatabase[0].segment
      .should.equal('evening')
  })

})

describe('Pressing on unknown avatar (daytime)', function() {
  var context = noReportsContext({
    name: 'Våfflan', date: '2014-04-04'
  })
  beforeEach(context.runPress('person', 
    context.config.userAndFriends.id, '2014-04-04', 'daytime'))

  it('writes the report to the database (date)', function() {
    context.reportsInDatabase[0].date
      .should.equal('2014-04-04')
  })
})

describe('Pressing on unknown avatar (other day)', function() {
  var context = noReportsContext({
    name: 'Våfflan', date: '2013-01-01'
  })
  beforeEach(context.runPress('person', 
    context.config.userAndFriends.id, '2012-01-01', 'daytime'))

  it('writes the report to the database (segment)', function() {
    context.reportsInDatabase[0].segment
      .should.equal('daytime')
  })
})

describe('Pressing on unknown avatar (other day)', function() {
  var context = singleReportContext({
    date: '2013-09-03',   segment: 'daytime',
    name: 'Irrelevant',   availability: 'free'
  })
  beforeEach(context.runPress('person', 
    context.config.userAndFriends.id, '2013-09-03', 'daytime'))

  it('writes the report to the database (availability)', function() {
    context.reportsInDatabase[0].availability
      .should.equal('unknown')
  })
})

describe('Clicking friend', function() {
  var context = friendReportContext({
    date: '2013-12-05', 
    segment: 'evening', name: 'John',   
    friendName: 'Samantha', availability: 'free'
  })
  beforeEach(context.runPress('person', 
    context.config.userAndFriends.friends[0].id, '2013-09-03', 'daytime'))

  it('should not have changed availability', function() {
    var friendReport = context.reportsInDatabase[0]
    var friendId = context.config.userAndFriends.friends[0].id
    friendReport.availability.should.equal('free')
    friendReport.user_id.should.equal(friendId)
  })

  it('should not have changed availability', function() {
    var myReport = context.reportsInDatabase[1]
    var myId = context.config.userAndFriends.id
    myReport.availability.should.equal('free')
    myReport.user_id.should.equal(myId)
  })

})


  



function noReportsContext(opts) {
  if (!opts.name) throw new Error('opts.name not found')  
  if (!opts.date) throw new Error('opts.date not found')
  var me = facebookUserContext(opts)
  me.config.timeOverride = new Date(Date.parse(opts.date))
  me.config.reports = []
  return me
}


function singleReportContext(opts) {
  if (!opts.name) throw new Error('opts.name not found')  
  if (!opts.date) throw new Error('opts.date not found')
  if (!opts.segment) throw new Error('opts.segment not found')
  if (!opts.availability) throw new Error('opts.availability not found')

  var me = facebookUserContext(opts)
  me.config.timeOverride = new Date(Date.parse(opts.date))
  me.config.reports = [{
    user_id: '63278723892032198',
    availability: opts.availability,
    date: opts.date,
    segment: opts.segment
  }]
  me.afterRun = function() {
    if(!!me.yield) {
      me.renderedPerson = 
        me.yield.days[0].segments[opts.segment].persons[0];
    }
  }
  return me
}

function friendReportContext(opts) {
  if (!opts.name)       throw new Error('opts.name not found')  
  if (!opts.friendName)       throw new Error('opts.friendName not found')  
  if (!opts.date)       throw new Error('opts.date not found')
  if (!opts.segment)    throw new Error('opts.segment not found')
  if (!opts.availability) throw new Error('opts.availability not found')

  var me = facebookSessionContext(opts)
  
  me.config.timeOverride = new Date(Date.parse(opts.date))

  me.config.userAndFriends = {
    id: '333333333333',
    first_name: opts.name,
    picture: 'http://irrelevant.com/john.jpg',
    friends: [{
      id: '6666666666',
      first_name: opts.friendName
    }]
  }
  me.config.reports = [{
    user_id: '6666666666',
    availability: opts.availability,
    date: opts.date,
    segment: opts.segment
  }]
  return me
}

// TODO: Better public interface for contexts? 
// 
// Hasfriend?
// has basic verbose ones, encapsulating contexts inherit them


function facebookUserContext(opts) {
  if (!opts.name) throw new Error('opts.name not found')
  var me = facebookSessionContext()
  me.config.userAndFriends = {
    id: '63278723892032198',
    first_name: opts.name,
    picture: 'http://facebook.com/lesser_people/rolf.jpg'
  }
  return me
}

function facebookSessionContext() {
  var me = overviewContextBase()
  me.config.sessionData = {
    facebook_token: '' + Math.floor(Math.random()*1000000)
  }
  return me
}

function overviewContextBase() {
  var me = {}

  me.config = {}
  me.yield = null

  me.afterRun = function() {}

  me.runOverview = function(next) {
    me.run('overview', undefined, next)
  }
  me.runPress = function() {
    var args = Array.prototype.slice.call(arguments)
    return function(next) {
      me.run('press', args, next)
    }
  }
  me.run = function(fnName, args, next) {

    if (!next)  throw new Error('callback was not defined')
    if (!me.config.reports)         throw new Error('reports missing')
    if (!me.config.userAndFriends)  throw new Error('userAndFriends missing')
    if (!me.config.timeOverride)    throw new Error('timeOverride missing')
      
    var connP = QStore.connect("mongodb://localhost:27017")
    var collP = connP.then(QStore.collection('reports'))

    var populatedCollectionP = collP
        .then(QStore.clear)
        .thenResolve(collP)
        .then(QStore.insert(me.config.reports))
        .thenResolve(connP)

    populatedCollectionP.then(function(connection) {

      var time = newTime()
      time.override(me.config.timeOverride)

      var QUser = {
        getUserAndFriends: function fakeGetUser(token, next) {
          if (token != me.config.sessionData['facebook_token']) 
            throw new Error('token was incorrect')
          next(null, me.config.userAndFriends)
        },
        get: function(token) {
          if (token != me.config.sessionData['facebook_token']) 
            throw new Error('token was incorrect')
          return Q.fcall(function() {
            return me.config.userAndFriends
          })
        }
      }

      
      
      var session = {
        get: function fakeSessionGet(key) {
          if (key === 'facebook_token') 
            return me.config.sessionData['facebook_token']
          throw new Error('Tried to get ' + key)
        }
      }
          
      return Q.npost(newApp(connection, time, QUser, session), fnName, args)
    })
    .then(function(overviewData) {
      me.yield = overviewData
    })
    .thenResolve(collP)
    .then(QStore.find({}))
    .then(function(reports) {
      me.reportsInDatabase = reports
      me.afterRun()
    })
    .thenResolve(connP).then(function(connection) {
      connection.close()
    })
    .nodeify(next)

    return me
  }

  return me
}




