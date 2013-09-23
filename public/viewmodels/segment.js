define([ 
    '/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/person.js',
    '/lazy-map.js'
    ], function(ko, newPerson, lazyMap) {
    return function newSegment(eventBus) {

      var api = {}

      api.type  = ko.observable()
      api.label = ko.observable()
      api.persons = ko.observableArray()

      api.parse = function(opts) {
        
        if (!opts.on_click)
            throw new Error('Property on_click was not provided.')
        if (!opts.persons)
            throw new Error('Property persons was not provided.')
        if (!opts.label)
            throw new Error('Property label was not provided.')

        api.type(opts.type)
        api.label(opts.label)
        api.clicked =  eventBus.dispatch.bind(null, 'click', opts.on_click)
        var personArrMutaded = lazyMap({
          sourceArr: opts.persons,
          targetArr: api.persons.peek(),
          createFunc: function(sourceData) {
            var p = newPerson(api, eventBus)
            p.parse(sourceData) 
            return p
          },
          updateFunc: function(sourceData, targetItem) {
            targetItem.parse(sourceData)
          }
        })

        if (personArrMutaded) api.persons.valueHasMutated()
      }

      return api;
    };
});