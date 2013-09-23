define([
	'/knockout/build/output/knockout-latest.debug.js',
	'/viewmodels/day.js',
    '/lazy-map.js'
	], function(ko, DayViewModel, lazyMap) {
    function OverviewViewModel(eventBus) {
    	
    	var self = this

        self.greeting = ko.observable()
    	self.days = ko.observableArray()

        self.parse = function(opts) {
            if (!opts)
                throw new Error('Argument options was not provided.')
            if (!opts.days)
                throw new Error('Property days was not provided.')
            if (!opts.greeting)
                throw new Error('Property greeting was not provided.')

            self.greeting(opts.greeting)

            var daysArrMutated = lazyMap({
                sourceArr: opts.days,
                targetArr: self.days.peek(),
                createFunc: function(sourceData) {
                    var dvm = new DayViewModel(eventBus)
                    dvm.parse(sourceData) 
                    return dvm
                },
                updateFunc: function(sourceData, targetItem) {
                    targetItem.parse(sourceData)
                }
            })

            if (daysArrMutated) self.days.valueHasMutated()
        }

	};

	return OverviewViewModel;
});