define([
	'/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/segment.js' ], function(ko, newSegment) {
    return function DayViewModel(opts) {

    	if (!opts.heading)
    		throw new Error('Property heading was not provided.')
        if (!opts.subheading)
            throw new Error('Property subheading was not provided.')
        if (!opts.segments)
            throw new Error('Property segments was not provided.')
    	
    	var self = this

    	self.heading    = ko.observable(opts.heading)
        self.subheading = ko.observable(opts.subheading)

        self.segments = ko.computed(function() {
            return opts.segments.map(newSegment)
        })

    };
});