define([], function() {
  function newFacade(opts) {

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

      overviewState.days.push({
        label: weekday + ' ' + d.getDate(),
        segments: {
          daytime: {
            label: 'Daytime',
            persons: [{
              imageSrc: '/images/test/louise.jpg',
              look: 'unknown',
              label: '*You* are **unknown** during *evening* this *Monday*'
            }]
          },
          evening: {
            label: 'Evening',
            persons: [{
              imageSrc: '/images/test/louise.jpg',
              look: 'unknown',
              label: '*You* are **unknown** during *evening* this *Monday*'
            }]
          }
        }
      })
    }

    var api = {}

    api.loadOverview = function(next) {
      setTimeout(function() {
        next(null, overviewState)
      }, 100)
    }

    return api; 
  }
  return newFacade;
})