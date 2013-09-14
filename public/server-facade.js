define([], function() {
  function newFacade(opts) {

    var overviewStateHandler = null;

    var api = {}

    var faye = new Faye.Client('/faye');
    
    var overviewSubscription;
    var refreshState = function() {
      $.ajax({
        url: '/overview.json',
        dataType: 'json',
        timeout: 2500 
      })
      .done(function(data) { 
        if(!data.change_channel)
          throw new Error("Data did not have change_channel property")
        if(!overviewSubscription) {
          overviewSubscription =
            faye.subscribe('/'+data.change_channel, refreshState)
        }
        
        overviewStateHandler(data);
      })
      .fail(function(jqXHR, textStatus, errorThrown) { 
        if(jqXHR.status === 403) return window.location='/facebook-auth';
        if(jqXHR.status === 404) return console.warn('/overview.json not found.');
        if(jqXHR.statusText === 'timeout') return console.warn('/overview.json timed out.');
        console.warn( "Could not fetch /overview.json:", textStatus, errorThrown, jqXHR); 
      })
    }
    api.streamOverview = function(handler) {
      overviewStateHandler = handler;
      setTimeout(refreshState, 25);
    }
    api.press = function(path) {
      var uri = 'press/' + path
      $.ajax({
        url: uri,
        timeout: 2500 
      })
      .fail(function(jqXHR, textStatus, errorThrown) { 
        if(jqXHR.status === 403) return window.location='/facebook-auth';
        if(jqXHR.status === 404) return console.warn(uri +' not found.');
        if(jqXHR.statusText === 'timeout') return console.warn(uri + ' timed out.');
        console.warn( "Could not fetch " + uri + ":", textStatus, errorThrown, jqXHR); 
      })
    }

    return api; 
  }
  return newFacade;
})