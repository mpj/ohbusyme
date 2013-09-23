define([ 
	'/knockout/build/output/knockout-latest.debug.js',
    '/marked/lib/marked.js',
	'/viewmodels/tooltip.js'
], function(ko, marked, newTooltip) {
    return function newPerson(parent, eventBus) {

    	var api = {}

        api.look = ko.observable()
        api.imageSrc = ko.observable()
        api.tooltip = newTooltip()

        api.mouseover = function() { api.tooltip.isVisible(true) }
        api.mouseout  = function() { api.tooltip.isVisible(false) }

        api.clicked = function() {
            // Latency compensate by switching state
            api.look(api.look() === 'unknown' ? 'free' : 'unknown') 
            parent.clicked()
        }

        api.parse = function(opts) {
            
            if (!opts.look)
                throw new Error('Property look was not provided.')
            if (!opts.imageSrc)
                throw new Error('Property imageSrc was not provided.')
            if (!opts.label)
                throw new Error('Property label was not provided.')

            api.look(opts.look)
            api.imageSrc(opts.imageSrc)
            api.tooltip.body(opts.label)
            
            if (opts.highlight) api.tooltip.isVisible(true)
        }

        return api;
    };
});