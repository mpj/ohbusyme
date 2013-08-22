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
        update: function(element, valueAccessor) {  
          
          var text =ko.unwrap(valueAccessor())
          $(element).tooltip("destroy").tooltip({
            html: true,
            title: text,
            trigger: "manual"
          })  

          // TODO: This won't work, jQuery is all centered around
          // event delegation. Need to figure something else out.
          $(element).mouseenter(function() {
            
            $(element).tooltip('show');
          }).mouseleave(function() {
            $(element).tooltip('hide');
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