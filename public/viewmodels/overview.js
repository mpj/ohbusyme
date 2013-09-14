define([
	'/knockout/build/output/knockout-latest.debug.js',
	'/viewmodels/day.js'
	], function(ko, DayViewModel) {
    function OverviewViewModel(opts, eventBus) {

        if (!opts)
            throw new Error('Argument options was not provided.')
        if (!opts.days)
            throw new Error('Property days was not provided.')
        if (!opts.greeting)
            throw new Error('Property greeting was not provided.')
    	
    	var self = this

        self.greeting = ko.observable(opts.greeting)

    	self.days = ko.computed(function() {
            return opts.days.map(function(d) {
                return new DayViewModel(d, eventBus);
            })
        })

	};

	return OverviewViewModel;
});