function newApp(mongo, time, facebook, session) {

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

    overview: function(next) {
      var days = []
      
      facebook.getUserAndFriends(session.get('facebook_token'), function(err, userAndFriends) {
        var persons = {}
        persons[userAndFriends.id] = {
          first_name: userAndFriends.first_name,
          picture:    userAndFriends.picture
        }
         
        mongo.collection('availabilities')
        .find({ fb_user_id: { $in: Object.keys(persons)} })
        .toArray(function(err, avails) {

          // Days with headings
          var timeCursor = time.get()
          for(var i = 0; i < displayDays; i++) {
            var day = {
              heading: weekDayText(timeCursor) + ' ' + dateText(timeCursor),
              segments: {
                daytime: {
                  heading: "Daytime"
                },
                evening: {
                  heading: "Evening"
                }
              }
            }

            var matchesDay = avails.filter(function(a) {
              return a.date === storeDate(timeCursor) })
            var matches = {
              daytime: matchesDay.filter(function(a) { return a.segment === 'daytime' }),
              evening: matchesDay.filter(function(a) { return a.segment === 'evening' })
            }

            day.segments.daytime.persons = matches.daytime.map(function(a) {
              return {
                imageSrc: persons[a.fb_user_id].picture
              }
            })
            day.segments.evening.persons = matches.evening.map(function(a) {
              return {
                imageSrc: persons[a.fb_user_id].picture
              }
            })

            days.push(day) 

            timeCursor.setDate(timeCursor.getDate() + 1)
            
          }


          next(null, {
            days: days
          })
        })
      })
    }
  }
  return api;
}

module.exports = newApp