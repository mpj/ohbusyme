define([ 
	'/knockout/build/output/knockout-latest.debug.js',
    '/marked/lib/marked.js',
	'/viewmodels/tooltip.js'
], function(ko, marked, newTooltip) {
    return function newPerson(opts, eventBus) {

        if (!opts.id)
            throw new Error('Property id was not provided.')
        if (!opts.look)
            throw new Error('Property look was not provided.')
        if (!opts.imageSrc)
            throw new Error('Property imageSrc was not provided.')
        if (!opts.label)
            throw new Error('Property label was not provided.')

    	var api = {}

        api.look = ko.observable(opts.look);

        api.imageSrc = ko.observable(opts.imageSrc)

        api.tooltip = newTooltip(marked(opts.label));

        api.mouseover = function() { api.tooltip.isVisible(true) }
        api.mouseout  = function() { api.tooltip.isVisible(false) }
        api.clicked = eventBus.dispatch.bind(null, 'person_clicked', opts.id)

        return api;
    };
});