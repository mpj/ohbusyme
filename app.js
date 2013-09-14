var Q = require('q')
var QStore = require('./q-store-mongo')
var ObjectId = require('mongodb').ObjectID;
var moment  = require('moment')

Q.longStackSupport = true;

function newApp(storeConnection, time, QUser, session, publish) {

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

    press: function(segment, date, next) {
      
      if (segment !== 'daytime' && segment !== 'evening') 
        throw new Error('Invalid segment: ' + segment)

      if (!moment(date).isValid())
        throw new Error('Invalid date: ' + date)

      var userP = QUser.get(session.get('facebook_token'))
      var collP = QStore.collection('reports')(storeConnection)
      Q.spread([ userP, collP ], function(user, reportsCollection) {
        return QStore.find({ 
          user_id: user.id,
          date: date,
          segment: segment
        })(reportsCollection).then(function(results) {
          if(results.length === 0) {
            return QStore.insert({ 
              user_id: user.id,
              availability: 'free',
              date: date,
              segment: segment
            })(reportsCollection)  
          } else {
            return QStore.update(
              { _id: results[0]._id },
              { 
                '$set': {
                  'availability': results[0].availability === 'free' ? 'unknown' : 'free'
                }
              })(reportsCollection).then(function() {
                return null
              })
          }
          
        }).then(function() {
          publish.trigger(user.id, 'changed')
          if(user.friends)
            user.friends.forEach(function(f) {
              publish.trigger(f.id, 'changed')
            })
        })
      })
      .nodeify(next)
    },

    overview: function(next) {
      var days = []

      var userP = QUser.get(session.get('facebook_token'))
      var collP = QStore.collection('reports')(storeConnection)
      var userMapP = userP.then(function(user) {
        var userMap = {}
        userMap[user.id] = {
          first_name: user.first_name,
          picture:    user.picture
        }
        if(user.friends)
          user.friends.forEach(function(f) {
            userMap[f.id] = {
              first_name: f.first_name,
              picture: f.picture
            }
          })
        return Q(userMap)
      })

      Q.spread([collP, userP, userMapP], function(collection, user, userMap) {
        return QStore
        .find({ user_id: { $in: Object.keys(userMap)} })(collection)
        .then(function(reports) {

          // Days with headings
          var timeCursor = time.get()
          for(var i = 0; i < displayDays; i++) {
            var day = {
              label: weekDayText(timeCursor) + ' ' + dateText(timeCursor),
            }

            day.segments = {
              daytime: newSegmentViewModelData('daytime', timeCursor, reports, userMap, user.id),
              evening: newSegmentViewModelData('evening', timeCursor, reports, userMap, user.id),
            }

            days.push(day) 

            timeCursor.setDate(timeCursor.getDate() + 1)
            
          }

          return Q({
            greeting: user.first_name + ", you are so busy!",
            change_channel: user.id,
            days: days
          })
        })
      }).nodeify(next)


      function newSegmentViewModelData(segmentName, timeCursor, reports, userMap, currentUserId) { 
        var storeDateStr = storeDate(timeCursor)

        var svmd = {}
        svmd.label = segmentName === 'evening' ? 'Evening' : 'Daytime'
        svmd.on_click = 'segment/' + storeDateStr + '/' + segmentName
        var currentUserHasReported = false
        svmd.persons = reports
          .filter(function(report) { 
            return report.date     === storeDateStr && 
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
              look: report.availability
            }
          })


        if(!currentUserHasReported)
          svmd.persons.unshift({
            imageSrc: userMap[currentUserId].picture,
            label: userMap[currentUserId].first_name,
            look: 'unknown'
          })
        
        return svmd
      }
    }
  }
  return api;
}

module.exports = newApp