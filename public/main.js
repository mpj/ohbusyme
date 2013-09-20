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
                  container: 'body'
                })
              
            },
            disposeWhenNodeIsRemoved: element
          })

          // This is a sort of weird hack around funky CSS3 behavior.
          // Because there is a CSS transition hiding and showing the 
          // tooltip that might take up to 150ms, we need to make sure 
          // that we don't change the visibility more often than 
          // 150ms. I'm not EXACTLY sure how this works, but we had a bug 
          // where calling show would do nothing, putting us in a stupid 
          // state. This seems to fix it completely.
          var setVisibility = _.debounce(function(isVisible) {
            isVisible ? 
              $(element).tooltip('show') : $(element).tooltip('hide') 
          }, 151)


          ko.computed({
            read: function() { setVisibility(viewModel.isVisible()) },
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