function newApp() {
  
  var api = {
    overview: function(next) {
      var days = new Array(18)
      days.unshift({
        heading: 'WED 04'
      })
      days.unshift({
        heading: 'TUE 03'
      })
      days.push({
        heading: 'TUE 24'
      })

      next(null, {
        days: days
      })
    }
  }
  return api;
}

module.exports = newApp