define([ 
    '/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/person.js'
    ], function(ko, newPerson) {
    return function newSegment(opts) {

        if (!opts.persons)
            throw new Error('Property persons was not provided.')
        if (!opts.heading)
            throw new Error('Property heading was not provided.' + JSON.stringify(opts))

    	var api = {}

        api.type = ko.observable(opts.type);

        api.persons = ko.computed(function() {
            if (!opts.persons) return [];
            return opts.persons.map(newPerson);
        })

        api.heading = ko.observable(opts.heading)

        ko.computed(function() {
            if (api.type() === 'evening') {
                api.persons().forEach(function(p) {
                    p.tooltip.placement('bottom');
                })  
            }
        })

        return api;
    };
});