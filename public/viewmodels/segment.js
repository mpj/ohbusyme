define([ 
    '/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/person.js'
    ], function(ko, newPerson) {
    return function newSegment(opts, eventBus) {

        if (!opts.on_click)
            throw new Error('Property on_click was not provided.')
        if (!opts.persons)
            throw new Error('Property persons was not provided.')
        if (!opts.label)
            throw new Error('Property label was not provided.')

    	var api = {}

        api.type = ko.observable(opts.type);

        api.persons = ko.computed(function() {
            if (!opts.persons) return [];
            return opts.persons.map(function(p) {
                return newPerson(p, eventBus)
            });
        })
 
        api.label = ko.observable(opts.label)

        api.clicked =  eventBus.dispatch.bind(null, 'click', opts.on_click)

        return api;
    };
});