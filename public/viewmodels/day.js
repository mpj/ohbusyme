define([
	'/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/segment.js' ], function(ko, newSegment) {
    return function DayViewModel(opts) {

    	if (!opts.label)
    		throw new Error('Property label was not provided.')
        if (!opts.segments)
            throw new Error('Property segments was not provided.')
        if (!opts.segments.evening)
            throw new Error('Property evening was not provided.')
        if (!opts.segments.daytime)
            throw new Error('Property daytime was not provided.')

    	
    	var self = this

    	self.label    = ko.observable(opts.label)

        self.segments = {
            daytime: newSegment(opts.segments.daytime),
            evening: newSegment(opts.segments.evening)
            
        }
    };
});