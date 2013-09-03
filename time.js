function newTime() {
  var override = null;

  var api = {
    get:      function()    { return override || Date.now },
    override: function(val) { override = val },
    reset:    function()    { override = null }
  }

  return api
}

module.exports = newTime