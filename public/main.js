    require.config({
    paths: {
        'moment': '/moment/moment',
    }
});

require([
  '/knockout/build/output/knockout-latest.debug.js',
  '/viewmodels/overview.js',
  'fake-facade.js',
   '/domready/ready.js'], function(ko, OverviewViewModel, newFacade, domReady) {
    domReady(function() {

      ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor) {  
          
          var viewModel = ko.unwrap(valueAccessor());
          
          if (!element.id)
            element.id = "" + Math.floor(Math.random()*10000000)

          ko.computed({
            read: function() {
              $(element).tooltip({
                html: true, 
                title: viewModel.body(), 
                placement: viewModel.placement(),
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

      var facade = newFacade();
      facade.loadOverview(function(err, state) {
        ko.applyBindings(new OverviewViewModel(state));
      })
      
    })
    
});