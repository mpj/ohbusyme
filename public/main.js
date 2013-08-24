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


      ko.applyBindings(new OverviewViewModel({
        days: [
          {
            subheading: '26 Aug',
            heading: 'Today, Monday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  }
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'free',
                    description: '*You* are **free** during *daytime* this *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },{ 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** this *Monday evening*.',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **free** this *Monday evening*.',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **often free** during *evenings* on *Monday*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  }
                ]
              }
            ]
          },
          {
            subheading: '27 Aug',
            heading: 'Tomorrow, Tuesday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'free',
                    description: '*You* are **free** during *daytime* this *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  }
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '28 Aug',
            heading: 'Wednesday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '29 Aug',
            heading: 'Thursday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '30 Aug',
            heading: 'Friday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '31 Aug',
            heading: 'Saturday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
          {
            subheading: '1 Sept',
            heading: 'Sunday',
            segments: [
              {
                type: 'daytime',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              },
              {
                type: 'evening',
                persons: [
                  { 
                    type: 'oftenfree',
                    description: '*You* are shown as **often free** during *daytime* on *Mondays*',
                    imageSrc: '/images/test/louise.jpg'
                  },
                  { 
                    imageSrc: '/images/test/fredrik.jpg',
                    description: '*Fredrik* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/magnus.jpg',
                    description: '*Magnus* is **free** during *daytime* this *Monday*',
                    type: 'free'
                  },
                  { 
                    imageSrc: '/images/test/jenny.jpg',
                    description: '*Jenny* is **often free** during *daytime* on *Mondays*',
                    type: 'oftenfree'
                  },
                  { 
                    imageSrc: '/images/test/kim.jpg',
                    description: '*Kim* is **often busy** during *daytime* on *Mondays*',
                    type: 'oftenbusy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                  { 
                    imageSrc: '/images/test/mattias.jpg',
                    description: '*Mattias* is **busy** during *daytime* this *Monday*',
                    type: 'busy'
                  },
                ]
              }
            ]
          },
        ]
      }));
    })
    
});