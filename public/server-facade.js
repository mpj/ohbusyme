define([], function() {
  function newFacade(opts, eventBus) {

    var overviewStateHandler = null;

    var api = {}

    var refreshState = function() {
      $.ajax({
        url: '/overview.json',
        dataType: 'json',
        timeout: 500 
      })
      .done(function(data) { 
        overviewStateHandler(data);
      })
      .fail(function(jqXHR, textStatus, errorThrown) { 
        if(jqXHR.status === 404) return console.warn('/overview.json not found.');
        if(jqXHR.statusText === 'timeout') return console.warn('/overview.json timed out.');
        console.warn( "Could not fetch /overview.json:", textStatus, errorThrown, jqXHR); 
      })
    }
    api.streamOverview = function(handler) {
      overviewStateHandler = handler;
      setTimeout(refreshState, 25);
    }

    eventBus.subscribe('segment_clicked', function(id) {
      // TODO send to server
    })

    return api; 
  }
  return newFacade;
})