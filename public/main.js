    require.config({
    paths: {
        'moment': '/moment/moment',
    }
});

require([
  '/knockout/build/output/knockout-latest.debug.js',
  '/viewmodels/overview.js',
   '/domready/ready.js'], function(ko, OverviewViewModel, domReady) {
    domReady(function() {

      ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor) {  
          
          var viewModel = ko.unwrap(valueAccessor());
          
          ko.computed({
            read: function() {
              $(element).tooltip("destroy").tooltip({
                html: true, title: viewModel.body(), trigger: "manual"
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


      ko.applyBindings({
        days: [
          {
            subheading: '26 Aug',
            heading: 'Today, Monday',
            segments: [
              {
                symbol: 'daytime',
                people: [
                  { 
                    style: 'oftenfree',
                    tooltip: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    tooltip: '*Fredrik* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    tooltip: '*Magnus* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    tooltip: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    style: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    tooltip: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    style: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                ]
              },
              {
                symbol: 'evening',
                people: [
                  { 
                    style: 'oftenfree',
                    tooltip: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    tooltip: '*Fredrik* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    tooltip: '*Magnus* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    tooltip: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    style: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    tooltip: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    style: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '27 Aug',
            heading: 'Tomorrow, Tuesday',
            segments: [
              {
                symbol: 'daytime',
                people: [
                  { 
                    style: 'oftenfree',
                    tooltip: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    tooltip: '*Fredrik* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    tooltip: '*Magnus* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    tooltip: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    style: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    tooltip: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    style: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                ]
              },
              {
                symbol: 'evening',
                people: [
                  { 
                    style: 'oftenfree',
                    tooltip: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    tooltip: '*Fredrik* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    tooltip: '*Magnus* is **free** during *daytime* this *Monday*',
                    style: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    tooltip: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    style: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    tooltip: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    style: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    tooltip: '*Mattias* is **busy** during *daytime* this *Monday*',
                    style: 'busy'
                  },
                ]
              }
            ]
          },
        ]
      });
    })
    
});