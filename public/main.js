    require.config({
    paths: {
        'moment': '/moment/moment',
    },
    waitSeconds: 12
});

require([
  '/knockout/build/output/knockout-latest.debug.js',
  '/viewmodels/overview.js',
  'server-facade.js',
   '/domready/ready.js'], function(ko, OverviewViewModel, newFacade, domReady) {
    domReady(function() {
      
      var newEventBus = function() {
        var subscribers = {}
        return {
          dispatch: function(type, path) {
            if (!subscribers[type]) return
            subscribers[type].forEach(function(fn) { fn(path) })
          },

          subscribe: function(type, handler) {
            subscribers[type] = subscribers[type] || []
            subscribers[type].push(handler)
          }
        }
      }

      function enforceBoxes() {
        var firstColumn = $('.day .segment')[0]
        var colWidth = $(firstColumn).width();
        $('.segment').height(colWidth)
        $('.person').height(colWidth)
        $('.segment .icon').css('line-height', colWidth+'px')
        
        $('.notification').each(function(i,e) {
          if (!$(e).data('originalHeight')) $(e).data('originalHeight', $(e).height())
          var h = $(e).data('originalHeight')
          $(e).height(colWidth * Math.ceil(h / colWidth))
          var $body = $(e).find('.body')
          var offset = ($(e).height() - $body.outerHeight()) / 2
          $body.css('top', offset+'px')
        })
      }

      
      var bindingsApplied = false;
      var eventBus = newEventBus();
      var appViewModel = {
        overview: new OverviewViewModel(eventBus)
      }
      var facade = newFacade({}, eventBus);
      facade.streamOverview(function(state) {
        appViewModel.overview.parse(state)
        if (!bindingsApplied) {
          bindingsApplied = true;
          ko.applyBindings(appViewModel);
          $(window).resize(_.debounce(enforceBoxes, 0))
        }
        enforceBoxes();
      })


      eventBus.subscribe('click', facade.press)
    })
});