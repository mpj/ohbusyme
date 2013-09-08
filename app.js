var Q = require('q')
var QStore = require('./q-store-mongo')

function newApp(storeConnection, time, facebook, session) {

  var displayDays = 21

  function weekDayText(date) { 
    switch(date.getDay()) {
      case 0: return 'SUN'
      case 1: return 'MON'
      case 2: return 'TUE'
      case 3: return 'WED'
      case 4: return 'THU'
      case 5: return 'FRI'
      case 6: return 'SAT'
    }
  }

  function weekDayLongText(date) {
    switch(date.getDay()) {
      case 0: return 'Sunday'
      case 1: return 'Monday'
      case 2: return 'Tuesday'
      case 3: return 'Wednesday'
      case 4: return 'Thursday'
      case 5: return 'Friday'
      case 6: return 'Saturday'
    }
  }

  function dateText(date) {
    var str = '' + date.getDate()
    return str.length === 1 ? '0' + str : str
  }

  function padded(num) {
    return num < 10 ? '0' + num : '' + num
  }

  function storeDate(date) {
    return  date.getFullYear() 
            + '-' + 
            padded(date.getMonth() + 1)
            + '-' + 
            padded(date.getDate())
  }

  var api = {

    press: function(topic, target, date, segment, next) {
      var QUser = facebook; // intermedieate hack
      var userP = QUser.get(session.get('facebook_token'))
      var collP = QStore.collection('reports')(storeConnection)
      Q.spread([ userP, collP ], function(user, coll) {
        QStore.insert({ 
          user_id: user.id,
          availability: 'free',
          date: date,
          segment: segment
        })(coll)
      })
      .nodeify(next)
    },

    overview: function(next) {
      var days = []
      
      facebook.getUserAndFriends(session.get('facebook_token'), function(err, userAndFriends) {
        var userMap = {}
        userMap[userAndFriends.id] = {
          first_name: userAndFriends.first_name,
          picture:    userAndFriends.picture
        }
        var currentUserId = userAndFriends.id
        if(userAndFriends.friends)
          userAndFriends.friends.forEach(function(f) {
            userMap[f.id] = {
              first_name: f.first_name,
              picture: f.picture
            }
          })
        
        storeConnection.createCollection('reports', function(err, collection) {
          if (err) return next(err)
          collection
          .find({ user_id: { $in: Object.keys(userMap)} })
          .toArray(function(err, reports) {

            // Days with headings
            var timeCursor = time.get()
            for(var i = 0; i < displayDays; i++) {
              var day = {
                heading: weekDayText(timeCursor) + ' ' + dateText(timeCursor),
              }

              function newSegmentViewModelData(segmentName) { 
                var svmd = {}
                svmd.heading = segmentName === 'evening' ? 'Evening' : 'Daytime'

                var currentUserHasReported = false
                svmd.persons = reports
                  .filter(function(report) { 
                    return report.date     === storeDate(timeCursor) && 
                           report.segment  === segmentName 
                  })
                  .map(function(report) {
                    if (report.user_id === currentUserId)
                      currentUserHasReported = true
                    return {
                      imageSrc: userMap[report.user_id].picture,
                      label: '*' + userMap[report.user_id].first_name + 
                             '* is **' + report.availability + '** ' + 
                             'during *' + segmentName + '* this *' + 
                             weekDayLongText(timeCursor) + '*',
                      appearance: report.availability
                    }
                  })

                if(!currentUserHasReported)
                  svmd.persons.unshift({
                    label: userMap[userAndFriends.id].first_name,
                    appearance: 'unknown'
                  })

                return svmd
               
              }

              day.segments = {
                daytime: newSegmentViewModelData('daytime'),
                evening: newSegmentViewModelData('evening'),
              }

              days.push(day) 

              timeCursor.setDate(timeCursor.getDate() + 1)
              
            }


            next(null, {
              days: days
            })
          })
        })
      })
    }
  }
  return api;
}

module.exports = newApp