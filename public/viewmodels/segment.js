define([ 
    '/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/person.js'
    ], function(ko, newPerson) {
    return function newSegment(opts, eventBus) {

        
        if (!opts.id)
            throw new Error('Property id was not provided.')
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

        ko.computed(function() {
            if (api.type() === 'evening') {
                api.persons().forEach(function(p) {
                    p.tooltip.placement('bottom');
                })  
            }
        })

        api.clicked =  eventBus.dispatch.bind(null, 'segment_clicked', opts.id)

        return api;
    };
});