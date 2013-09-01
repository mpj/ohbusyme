define([], function() {
  function newFacade(opts, eventBus) {

    opts = opts || {}
    opts.numDays = opts.numDays || 21

    var overviewState = {
      days: []
    }

    for (var i = 0; i < opts.numDays; i++) {
      var d = new Date();
      d.setDate(d.getDate() + i)

      var weekday;
      if (d.getDay() === 0)
        weekday = 'SUN';
      else if(d.getDay() === 1)
        weekday = 'MON';
      else if(d.getDay() === 2)
        weekday = 'TUE';
      else if(d.getDay() === 3)
        weekday = 'WED';
      else if(d.getDay() === 4)
        weekday = 'THU';
      else if(d.getDay() === 5)
        weekday = 'FRI';
      else if(d.getDay() === 6)
        weekday = 'SAT';

      var dateStr = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
      overviewState.days.push({
        label: weekday + ' ' + d.getDate(),
        segments: {
          daytime: {
            label: 'Daytime',
            id: dateStr + '-daytime',
            persons: [{
              imageSrc: '/images/test/louise.jpg',
              look: 'unknown',
              label: '*You* are **unknown** during *evening* this *Monday*'
            }]
          },
          evening: {
            label: 'Evening',
            id: dateStr + '-evening',
            persons: [{
              imageSrc: '/images/test/louise.jpg',
              look: 'unknown',
              label: '*You* are **unknown** during *evening* this *Monday*'
            }]
          }
        }
      })
    }

    var overviewStateHandler = null;

    var api = {}

    var refreshState = function() {
      overviewStateHandler(overviewState);
    }
    api.streamOverview = function(handler) {
      overviewStateHandler = handler;
      setTimeout(refreshState, 25);
    }

    eventBus.subscribe('segment_clicked', function(id) {
      overviewState.days.forEach(function(d) {
        [d.segments.evening, d.segments.daytime].forEach(function(s) {
          if(s.id === id)
            s.persons.forEach(function(p) {
              p.look = p.look === 'free' ? 'unknown' : 'free'
            })
        })
      })
      refreshState()
    })

    return api; 
  }
  return newFacade;
})