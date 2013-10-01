var chai = require('chai')
chai.should()
var expect = chai.expect
var newApp = require('../app.js')
var newTime = require('../time.js')
var _ = require('underscore')
var Q = require('q')
var QStore = require('../q-store-mongo')

Q.longStackSupport = true;

describe('Lists day spans', function() {
  
  var context = singleReportContext({
    date: '2013-09-03',   segment: 'daytime',
    name: 'Irrelevant',   availability: 'free'
  })
  beforeEach(context.runOverview)

  it('should yield 14 days', function() {
    context.yield.days.length.should.equal(14)
  })

  it('yields 2013-09-03 as first day (label)', function() {
    context.yield.days[0].label.should.equal('Today')
  })

  it('yields 2013-09-03 as first day (sublabel)', function() {
    context.yield.days[0].sublabel.should.equal('3 September')
  })

  it('yields 2013-09-04 as second day', function() {
    context.yield.days[1].label.should.equal('Tomorrow')
  })

  it('yields 2013-09-04 as second day (sublabel)', function() {
    context.yield.days[1].sublabel.should.equal('4 September')
  })

  it('yields 2013-09-05 as third day', function() {
    context.yield.days[2].label.should.equal('Thursday')
  })

  it('yields 2013-09-05 as third day (sublabel)', function() {
    context.yield.days[2].sublabel.should.equal('5 September')
  })

  it('yields 2013-09-06 as fourth day', function() {
    context.yield.days[3].label.should.equal('Friday')
  })

  it('yields 2013-09-06 as fourth day (sublabel)', function() {
    context.yield.days[3].sublabel.should.equal('6 September')
  })

  it('yields 2013-09-07 as fifth day', function() {
    context.yield.days[4].label.should.equal('Saturday')
  })

  it('yields 2013-09-07 as fifth day (sublabel)', function() {
    context.yield.days[4].sublabel.should.equal('7 September')
  })

  it('yields 2013-09-08 as sixth day', function() {
    context.yield.days[5].label.should.equal('Sunday')
  })

  it('yields 2013-09-09 as sixth day (sublabel)', function() {
    context.yield.days[5].sublabel.should.equal('8 September')
  })

  it('yields 2013-09-16 as 14th day', function() {
    context.yield.days[13].sublabel.should.equal('16 September')
  })

})


describe('Virtual segments (no reports) ', function() {
  
  var context = noReportsContext({
    name: 'Maja', date: '2012-01-01', 
    picture: 'http://facebook.com/maja.jpg'
  })
  beforeEach(context.runOverview)

  it('should yield 14 days even though empty', function() {
    context.yield.days.length.should.equal(14)
  })


  it('yields 2012-01-01 as first day', function() {
    context.yield.days[0].sublabel.should.equal('1 January')
  })

  it('has notification about being free', function() {
    context.yield.days[0].notification
      .should.equal('Maja, are you free sometime this Sunday? Press your picture!')
  })

  it('... but only on the first day', function() {
    expect(context.yield.days[1].notification)
      .to.be.undefined
  })

  it('yields 2013-1-14 as 14th day', function() {
    context.yield.days[13].sublabel.should.equal('14 January')
  })

  it('has proper label on daytime segment', function() {
    context.yield.days[13].segments.daytime.label
      .should.equal('Daytime')
  })

  it('has proper label on evening segment', function() {
    context.yield.days[13].segments.evening.label
      .should.equal('Evening')
  })

  it('person has the right look', function() {
    context.yield.days[0].segments.daytime.persons[0].look
      .should.equal('unknown')
  })

  it('person has the right imageSrc', function() {
    context.yield.days[0].segments.daytime.persons[0].imageSrc
      .should.equal('http://facebook.com/maja.jpg')
  })

  it('highlights first virtual report', function() {
    context.yield.days[0].segments.daytime.persons[0].highlight
      .should.equal(true)
  })

  it('DOESNT highlight second virtual report', function() {
    expect(
      context.yield.days[0].segments.evening.persons[0].highlight
    ).to.be.undefined
  })

  it('DOESNT highlight third virtual report', function() {
    expect(
      context.yield.days[1].segments.daytime.persons[0].highlight
    ).to.be.undefined
  })
      
})

describe('Virtual segments (single report)', function() {
  
  var context = singleReportContext({
    date: '2013-09-09',   segment: 'daytime',
    name: 'Hank',         availability: 'free'
  })
  beforeEach(context.runOverview)


  it('should have notification on the second day', function() {
    context.yield.days[1].notification
      .should.equal('Hank, are you free sometime this Tuesday? Press your picture!')
  })

  it('but not on reported (first) day', function() {
    expect(context.yield.days[0].notification).to.be.undefined
  })

  it('should not add virtual element on reported segments', function() {
    context.yield.days[0].segments.daytime.persons.length
      .should.equal(1)
  })

  it('displays other segments as unknown', function() {
    context.yield.days[0].segments.evening.persons[0].look
      .should.equal('unknown')
  })

  it('displays other days as unknown', function() {
    context.yield.days[1].segments.evening.persons[0].look
      .should.equal('unknown')
  })

})

describe('Click tagging', function() {
  
  var context = singleReportContext({
    date: '2013-09-08',   segment: 'daytime',
    name: 'Hank',         availability: 'free'
  })
  beforeEach(context.runOverview)

  it('daytime (non-virtual)', function() {
    context.yield.days[0].segments.daytime.on_click.should.equal(
      'segment/2013-09-08/daytime')
  })

  it('daytime (non-virtual)', function() {
    context.yield.days[1].segments.evening.on_click.should.equal(
      'segment/2013-09-09/evening')
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

  it('displays user availability as look', function() {
    context.renderedPerson.look
      .should.equal('free')
  })

  it('displays other segments as unknown', function() {
    context.yield.days[0].segments.evening.persons[0].look
      .should.equal('unknown')
  })

  it('displays other days as unknown', function() {
    context.yield.days[1].segments.evening.persons[0].look
      .should.equal('unknown')
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

  it('shows virtual report last, as unknown', function() {
    context.yield.days[0].segments.evening.persons[1].look
      .should.equal('unknown')
  })

  it('shows friends first, as free', function() {
    context.yield.days[0].segments.evening.persons[0].look
      .should.equal('free')
  })

  it('shows friend available as notification', function() {
    context.yield.days[0].notification
      .should.equal('**Samantha** would like to know if you are free during *evening* on this *Wednesday*. If you are, press your picture!')
  })
})

describe('Virtual report label (two friends)', function() {
  var context = multiFriendReportsContext({
    friend1Name: 'Shablat',
    friend2Name: 'Johan',
    segment: 'evening'
  })
  beforeEach(context.runOverview)

  it('shows notification using friends names', function() {
    context.yield.days[0].notification
      .should.equal('**Shablat** and **Johan** would like to know if you are free during *evening* on this *Tuesday*. If you are, press your picture!')
  })

})

describe('Virtual report label (three friends)', function() {
  var context = multiFriendReportsContext({
    friend1Name: 'Shablat',
    friend2Name: 'Johan',
    friend3Name: 'Sauron',
    segment: 'evening'
  })
  beforeEach(context.runOverview)

  it('shows notification using friends names', function() {
    context.yield.days[0].notification
      .should.equal('**Shablat**, **Johan** and **Sauron** would like to know if you are free during *evening* on this *Tuesday*. If you are, press your picture!')
  })

})


describe('Pressing own avatar (evening)', function() {
   var context = noReportsContext({
    name: 'Maja', date: '2012-01-01'
  })
  beforeEach(context.runPress('evening', '2012-01-01'))

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

  it('publishes on user channel', function() {
    var message =
      context.publishedMessages[context.logged_in_user.id][0]
    message.event.should.equal('changed')
  })

})

describe('Pressing on virtual avatar (daytime)', function() {
  var context = noReportsContext({
    name: 'Våfflan', date: '2014-04-04'
  })
  beforeEach(context.runPress('daytime', '2014-04-04'))

  it('writes the report to the database (date)', function() {
    context.reportsInDatabase[0].date
      .should.equal('2014-04-04')
  })

  it('publishes on user channel', function() {
    var message =
      context.publishedMessages[context.logged_in_user.id][0]
    message.event.should.equal('changed')
  })
})

describe('Pressing on virtual avatar (other day)', function() {
  var context = noReportsContext({
    name: 'Våfflan', date: '2012-01-01'
  })
  beforeEach(context.runPress('daytime', '2012-01-01'))

  it('writes the report to the database (segment)', function() {
    context.reportsInDatabase[0].segment
      .should.equal('daytime')
  })

  it('dates the report', function() {
    context.reportsInDatabase[0].created
      .should.equal(Number(Date.parse('2012-01-01')))
  })
})

describe('Pressing on own free avatar', function() {
  var context = singleReportContext({
    date: '2013-09-03',   segment: 'daytime',
    name: 'Irrelevant',   availability: 'free'
  })
  beforeEach(context.runPress('daytime', '2013-09-03'))

  it('deleted the report from the database (availability)', function() {
    context.reportsInDatabase
      .length.should.equal(0)

  })

})




describe('Clicking same segment as friend', function() {
  var context = friendReportContext({
    date: '2013-12-05', 
    segment: 'evening', name: 'John',   
    friendName: 'Samantha', availability: 'free'
  })
  beforeEach(context.runPress('daytime', '2013-09-03'))

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

  it('publishes on user channel', function() {
    var message =
      context.publishedMessages[context.logged_in_user.id][0]
    message.event.should.equal('changed')
  })

  it('publishes on friend channel', function() {
    var message =
      context.publishedMessages[context.logged_in_user.friends[0].id][0]
    message.event.should.equal('changed')
  })
})

describe('Passing invalid segment name', function() {
   var context = noReportsContext({
    name: 'Maja', date: '2012-01-01'
  })

  it('throws error', function(done) {
    context.runPress('morning', '2012-01-01')(function(error, result) {
      error.message.should.equal('Invalid segment: morning')
      done()
    }) 
  })

  it('does not insert anything', function(done) {
    context.runPress('morning', '2012-01-01')(function() {
      context.reportsInDatabase.length.should.equal(0)
      done()
    })
  })

})

describe('Validates date input', function() {
   var context = noReportsContext({
    name: 'Maja', date: '2012-01-01'
  })

  it('throws error on invalid dates', function(done) {
    context.runPress('daytime', '2013-02-29')(function(error, result) {
      error.message.should.equal('Invalid date: 2013-02-29')
      done()
    }) 
  })

  it('does not insert anything if invalid', function(done) {
    context.runPress('daytime', '2013-02-29')(function() {
      context.reportsInDatabase.length.should.equal(0)
      done()
    })
  })

  it('does NOT error on valid ones', function(done) {
    context.runPress('daytime', '2012-02-29')(function(error, result) {
      context.reportsInDatabase.length.should.equal(1)
      done()
    }) 
  })
  
})

describe('Pressing own avatar (evening)', function() {
  var context = noReportsContext({
    name: 'Maja', date: '2012-01-01', facebook_user_id: '1234560'
  })
  beforeEach(context.runOverview)

  it('shows user id as change_channel', function() {
    context.yield.change_channel.should.equal('1234560')
  })

})


describe('Pressing own avatar (evening)', function() {
  var context = noReportsContext({
    name: 'Harald', date: '2012-01-01', facebook_user_id: '1234560'
  })
  beforeEach(context.runOverview)

  it('shows user id as change_channel', function() {
    context.yield.greeting.should.equal(
      'Harald, you are so busy!')
  })
})

describe('sort order', function() {
  var context = tripleReport1()
  beforeEach(context.runOverview)

  it('lists all reports', function() {
    context.yield.days[0].segments.evening.persons
      .length.should.equal(3)
  })

  it('puts first report first', function() {
    context.yield.days[0].segments.evening
      .persons[0].imageSrc.should.contain('hasse')
  })

  it('puts last report last', function() {
    context.yield.days[0].segments.evening
      .persons[2].imageSrc.should.contain('pelle')
  })
})

describe('sort order (inversed)', function() {
  var context = tripleReport2()
  beforeEach(context.runOverview)

  it('lists all reports', function() {
    context.yield.days[0].segments.evening.persons
      .length.should.equal(3)
  })

  it('puts first report first', function() {
    context.yield.days[0].segments.evening
      .persons[0].imageSrc.should.contain('pelle')
  })

  it('puts last report last', function() {
    context.yield.days[0].segments.evening
      .persons[2].imageSrc.should.contain('hasse')
  })
})

describe('me and friend reported on the same day', function() {
  var context = friendAndMeReportContext();
  beforeEach(context.runOverview)

  it('should not show notification on first day', function() {
    expect(context.yield.days[0].notification)
      .to.be.undefined
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
    date: opts.reportDate || opts.date,
    segment: opts.segment,
    created: Number(me.config.timeOverride)-3600*1000
  }]
  me.afterRun = function() {
    if(!!me.yield) {
      me.renderedPerson = 
        me.yield.days[0].segments[opts.segment].persons[0];
    }
  }
  return me
}

function friendAndMeReportContext(opts) {

  var me = facebookSessionContext(opts)

  me.config.timeOverride = new Date(Date.parse('2013-01-01'))

  me.config.userAndFriends = {
    id: '333333333333',
    first_name: 'Hasse',
    picture: 'http://cdn.com/hasse.jpg',
    friends: [
      {
        id: '6666666666',
        first_name: 'Nisse',
        picture: 'http://cdn.com/nisse.jpg',
      }
    ]
  }

  me.config.reports = [
    {
      user_id: '333333333333',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
    },
    {
      user_id: '6666666666',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
    },
  ]

  return me
 
}

// Simple report where user Hasse and his two friends have reported
// after eachother.
function tripleReport1(opts) {

  var me = facebookSessionContext(opts)

  me.config.timeOverride = new Date(Date.parse('2013-01-01'))

  me.config.userAndFriends = {
    id: '333333333333',
    first_name: 'Hasse',
    picture: 'http://cdn.com/hasse.jpg',
    friends: [
      {
        id: '6666666666',
        first_name: 'Nisse',
        picture: 'http://cdn.com/nisse.jpg',
      },
      {
        id: '8888888888',
        first_name: 'Pelle',
        picture: 'http://cdn.com/pelle.jpg',
      }
    ]
  }

  me.config.reports = [
    {
      user_id: '333333333333',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356991199 // first, 2012-12-31 23:59:59
    },
    {
      user_id: '8888888888',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356998399 // third, 2012-12-31 23:59:59
    },
    {
      user_id: '6666666666',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356994799 // second, 2012-12-31 22:59:59
    },
  ]

  return me
 
}

// Simple report where user Hasse and his two friends have reported
// after eachother, but inverse to tripleReport1
function tripleReport2(opts) {

  var me = facebookSessionContext(opts)

  me.config.timeOverride = new Date(Date.parse('2013-01-01'))

  me.config.userAndFriends = {
    id: '333333333333',
    first_name: 'Hasse',
    picture: 'http://cdn.com/hasse.jpg',
    friends: [
      {
        id: '6666666666',
        first_name: 'Nisse',
        picture: 'http://cdn.com/nisse.jpg',
      },
      {
        id: '8888888888',
        first_name: 'Pelle',
        picture: 'http://cdn.com/pelle.jpg',
      }
    ]
  }

  me.config.reports = [
    {
      user_id: '8888888888',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356991199 // 2012-12-31 23:59:59
    },
    {
      user_id: '6666666666',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356994799 // 2012-12-31 22:59:59
    },
    {
      user_id: '333333333333',
      availability: 'free',
      date: '2013-01-01',
      segment: 'evening',
      created: 1356998399 // 2012-12-31 23:59:59
    },

  ]

  return me
 
}

// Several friends have reports, you don't
function multiFriendReportsContext(opts) {
  if (!opts.friend1Name)       throw new Error('opts.friend1Name not found') 
  if (!opts.friend2Name)       throw new Error('opts.friend2Name not found')  
  if (!opts.segment)    throw new Error('opts.segment not found')

  var me = facebookSessionContext(opts)
  
  me.config.timeOverride = new Date(Date.parse('2013-01-01'))

  me.config.userAndFriends = 
  me.logged_in_user = {
    id: '333333333333',
    first_name: 'Defaultsson',
    picture: 'http://irrelevant.com/john.jpg',
  }

  me.logged_in_user.friends = [
    {
      id: '6666666666',
      first_name: opts.friend1Name,
    },
    {
      id: '8888888888',
      first_name: opts.friend2Name,
    }
  ]

  me.config.reports = [{
    user_id: '6666666666',
    availability: 'free',
    date: '2013-01-01',
    segment: opts.segment,
    created: 1
  },{
    user_id: '8888888888',
    availability: 'free',
    date: '2013-01-01',
    segment: opts.segment,
    created: 2
  }]

  if(opts.friend3Name) {
    me.logged_in_user.friends.push({
      id: '77777777777',
      first_name: opts.friend3Name,
    })
    me.config.reports.push({
      user_id: '77777777777',
      availability: 'free',
      date: '2013-01-01',
      segment: opts.segment,
      created: 3
    })
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

  me.config.userAndFriends = 
  me.logged_in_user = {
    id: '333333333333',
    first_name: opts.name,
    picture: 'http://irrelevant.com/john.jpg',
  }

  me.logged_in_user.friends = [{
    id: '6666666666',
    first_name: opts.friendName
  }]

  
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
  
  me.config.userAndFriends = 
  me.logged_in_user = {
    id: opts.facebook_user_id || '63278723892032198',
    first_name: opts.name,
    picture: opts.picture || 'http://facebook.com/lesser_people/rolf.jpg'
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

    me.reportsInDatabase = []
      
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

      me.publishedMessages = {}
      var publish = {
        trigger: function(channel, event, message) {
          me.publishedMessages[channel] = me.publishedMessages[channel] || []
          me.publishedMessages[channel].push({
            event: event,
            message: message
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
          
      return Q.npost(newApp(connection, time, QUser, session, publish), fnName, args)
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




