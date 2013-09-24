var Q = require('q')
var QStore = require('./q-store-mongo')
var ObjectId = require('mongodb').ObjectID;
var moment  = require('moment')

Q.longStackSupport = true;

function newApp(storeConnection, time, QUser, session, publish) {

  var displayDays = 14

  function weekDayLongText(date, today) {
    
    if (today) {
      if (moment(date).isSame(today, 'day')) return 'Today'
      var tomorrow = moment(today).add('days', 1);
      if (moment(date).isSame(tomorrow, 'day')) return 'Tomorrow'
    }
    return moment(date).format('dddd')
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
              segment: segment,
              created: Number(time.get()),
            })(reportsCollection)  
          } else {
            return QStore.remove(
              { _id: results[0]._id })(reportsCollection).then(function() {
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
          var isNotificationRendered = false
          var timeCursor = time.get()
          for(var i = 0; i < displayDays; i++) {
            var day = {
              label: weekDayLongText(timeCursor, time.get()),
              sublabel: timeCursor.getDate() + ' ' + moment(timeCursor).format('MMMM')
            }

            day.segments = {
              daytime: newSegmentViewModelData(day, 'daytime', timeCursor, reports, userMap, user.id),
              evening: newSegmentViewModelData(day, 'evening', timeCursor, reports, userMap, user.id),
            }

            var currentUserHasReported = reports.filter(function(report) { 
              return report.date     === storeDate(timeCursor) &&
                     report.user_id  === user.id
            }).length > 0;

            if (!currentUserHasReported) {
              
              ['daytime', 'evening'].forEach(function(segmentName) {

                if (isNotificationRendered) return;

                var reportsGroomed = reports.sort(function(a, b) {
          
                  // FIXME: Legacy reports, remove me after oct 4 2013
                  if (!a.created || !b.created) {
                    if (a._id < b._id) return -1
                    if (a._id > b._id) return 1
                    return 0  
                  }

                  if (a.created <   b.created) return -1
                  if (a.created === b.created) return 0
                  return 1
                })
                .filter(function(report) { 
                  return report.date     === storeDate(timeCursor) && 
                         report.segment  === segmentName && 
                         report.user_id  !== user.id
                })
                
                if (reportsGroomed.length > 0) {

                  isNotificationRendered = true
                  var names = '';
                  reportsGroomed.forEach(function(r, index) {
                    var name = userMap[r.user_id].first_name
                    if (names !== '') 
                      if (index === reportsGroomed.length-1) names += ' and '
                      else names += ', '
                    names += '**' + name + '**'
                  })
                  day.notification = 
                    names + ' would like to know if you are free during *' +
                    segmentName + '* on this *' + weekDayLongText(timeCursor) + '*. ' +
                    'If you are, press your picture!'
                }

              })
                
              if(!isNotificationRendered) {

                isNotificationRendered = true
                day.notification =  
                  user.first_name + ', are you free sometime this ' + 
                  weekDayLongText(timeCursor) + '? Press your picture!'
              }
              
            }
            
            

            days.push(day) 

            timeCursor.setDate(timeCursor.getDate() + 1)
            
          }

          var firstUnknown;
          days.forEach(function(day) {
            [day.segments.daytime, day.segments.evening].forEach(function(segment) {
              segment.persons.forEach(function(person) {
                if (person.look === 'unknown' && !firstUnknown) 
                  firstUnknown = person
              })
            })
          })
          firstUnknown.highlight = true

          return Q({
            greeting: user.first_name + ", you are so busy!",
            change_channel: user.id,
            days: days
          })
        })
      }).nodeify(next)


      function newSegmentViewModelData(day, segmentName, timeCursor, reports, userMap, currentUserId) { 
        var storeDateStr = storeDate(timeCursor)

        var svmd = {}
        svmd.label = segmentName === 'evening' ? 'Evening' : 'Daytime'
        svmd.on_click = 'segment/' + storeDateStr + '/' + segmentName
        var currentUserHasReported = false
        var reportsGroomed = reports.sort(function(a, b) {
          
          // FIXME: Legacy reports, remove me after oct 4 2013
          if (!a.created || !b.created) {
            if (a._id < b._id) return -1
            if (a._id > b._id) return 1
            return 0  
          }

          if (a.created <   b.created) return -1
          if (a.created === b.created) return 0
          return 1
        })
        .filter(function(report) { 
          return report.date     === storeDateStr && 
                 report.segment  === segmentName
        })
        svmd.persons = reportsGroomed.map(function(report) {
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

        if(!currentUserHasReported) {
          var currentUser = userMap[currentUserId]
          var currentUserVMD = {
            imageSrc: userMap[currentUserId].picture,
            look: 'unknown',
          }
         
          if (reportsGroomed.length > 0) {
            var names = '';
            reportsGroomed.forEach(function(r, index) {
              var name = userMap[r.user_id].first_name
              if (names !== '') 
                if (index === reportsGroomed.length-1) names += ' and '
                else names += ', '
              names += '**' + name + '**'
            })
            currentUserVMD.label = 
              names + ' would like to know if you are free during *' +
              segmentName + '* on this *' + weekDayLongText(timeCursor) + '*. ' +
              'If you are, press your picture!'
          } else {
            currentUserVMD.label = 
              currentUser.first_name  + ', are you free ' +
              'during ' + segmentName + ' this ' +  
              weekDayLongText(timeCursor) + '? ' +
              'Press your picture!'
          }
          svmd.persons.push(currentUserVMD)
        }
        
        return svmd
      }
    }
  }
  return api;
}

module.exports = newApp