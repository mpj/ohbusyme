define([
	'/knockout/build/output/knockout-latest.debug.js',
	'moment' ], function(ko, moment) {
    return function DayViewModel(opts) {

    	if (!opts.date)
    		throw new Error('Property date was not provided.')
    	
    	var self = this

    	self.heading = ko.computed(function() {
    		return moment(opts.date).format("MMM Do");
    	})

    };
});