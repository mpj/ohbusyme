define([ 
	'/knockout/build/output/knockout-latest.debug.js',
    '/marked/lib/marked.js',
	'/viewmodels/tooltip.js'
], function(ko, marked, newTooltip) {
    return function newPerson(opts) {

        if (!opts.type)
            throw new Error('Property type was not provided.')
        if (!opts.imageSrc)
            throw new Error('Property imageSrc was not provided.')
        if (!opts.label)
            throw new Error('Property label was not provided.')

    	var api = {}

        api.type = ko.observable(opts.type);

        api.imageSrc = ko.observable(opts.imageSrc)

        api.tooltip = newTooltip(marked(opts.label));

        api.mouseover = function() { api.tooltip.isVisible(true) }
        api.mouseout  = function() { api.tooltip.isVisible(false) }

        return api;
    };
});