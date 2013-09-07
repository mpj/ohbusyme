function newTime() {
  var override = null;

  // Clone dates to ensure immutability
  var clone = function(date) {
  	return new Date(date.getTime())
  }

  var api = {
    get:      function()    { return !!override ? clone(override) : new Date() },
    override: function(val) { override = clone(val) },
    reset:    function()    { override = null }
  }

  return api
}

module.exports = newTime