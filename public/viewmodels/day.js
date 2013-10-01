define([
	'/knockout/build/output/knockout-latest.debug.js',
    '/viewmodels/segment.js',
    '/marked/lib/marked.js' ], function(ko, newSegment, marked) {
    return function DayViewModel(eventBus) {
    	
    	var self = this

    	self.label          = ko.observable()
        self.sublabel       = ko.observable()
        self.notification   = ko.observable()

        self.segments = {
            daytime: newSegment(eventBus),
            evening: newSegment(eventBus)
        }

        self.parse = function(opts) {
            if (!opts.label)
                throw new Error('Property label was not provided.')
            if (!opts.sublabel)
                throw new Error('Property sublabel was not provided.')
            if (!opts.segments)
                throw new Error('Property segments was not provided.')
            if (!opts.segments.evening)
                throw new Error('Property evening was not provided.')
            if (!opts.segments.daytime)
                throw new Error('Property daytime was not provided.')

            self.notification(marked(opts.notification))
            self.label(opts.label)
            self.sublabel(opts.sublabel)
            self.segments.daytime.parse(opts.segments.daytime)
            self.segments.evening.parse(opts.segments.evening)
        }
    };
});