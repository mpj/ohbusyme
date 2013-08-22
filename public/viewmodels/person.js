define([ 
	'/knockout/build/output/knockout-latest.debug.js',
    '/marked/lib/marked.js',
	'/viewmodels/tooltip.js'
], function(ko, marked, newTooltip) {
    return function newPerson(opts) {

    	var api = {}

        api.type = ko.observable(opts.type);

        api.imageSrc = ko.observable(opts.imageSrc)

        api.tooltip = newTooltip(marked(opts.description));

        api.mouseover = function() { api.tooltip.isVisible(true) }
        api.mouseout  = function() { api.tooltip.isVisible(false) }

        return api;
    };
});