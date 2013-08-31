define([
	'/knockout/build/output/knockout-latest.debug.js',
	'/viewmodels/day.js'
	], function(ko, DayViewModel) {
    function OverviewViewModel(opts) {

        if (!opts)
            throw new Error('Argument options was not provided.')
        if (!opts.days)
            throw new Error('Property days was not provided.')
    	
    	var self = this

    	self.days = ko.computed(function() {
            return opts.days.map(function(d) {
                return new DayViewModel(d);
            })
        })

	};

	return OverviewViewModel;
});