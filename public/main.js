    require.config({
    paths: {
        'moment': '/moment/moment',
    }
});

require([
  '/knockout/build/output/knockout-latest.debug.js',
  '/viewmodels/overview.js',
  'server-facade.js',
   '/domready/ready.js'], function(ko, OverviewViewModel, newFacade, domReady) {
    domReady(function() {

      ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor, allBindingsAccessor) {  
          
          var viewModel = ko.unwrap(valueAccessor());
          var allBindings = allBindingsAccessor();
          
          if (!element.id)
            element.id = "" + Math.floor(Math.random()*10000000)

          ko.computed({
            read: function() {
              $(element).tooltip({
                html: true, 
                title: viewModel.body(), 
                placement: allBindings.tooltipPlacement || 'top',
                trigger: "manual",
                container: '#' + element.id
              })
            },
            disposeWhenNodeIsRemoved: element
          })

          ko.computed({
            read: function() {
              viewModel.isVisible() ? 
                $(element).tooltip('show') : 
                $(element).tooltip('hide')
            },
            disposeWhenNodeIsRemoved: element
          })
          
          ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).tooltip("destroy");
          });

        }
      }
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

      var appViewModel = {
        overview: ko.observable() 
      }
      var bindingsApplied = false;
      var eventBus = newEventBus();
      var facade = newFacade({}, eventBus);
      facade.streamOverview(function(state) {
        appViewModel.overview(new OverviewViewModel(state, eventBus))
        if (!bindingsApplied) {
          bindingsApplied = true;
          ko.applyBindings(appViewModel);
        }
      })


      eventBus.subscribe('click', facade.press)
    })
});