define([ 
	'/knockout/build/output/knockout-latest.debug.js',
], function(ko) {
    return function newTooltip(body) {

    	var api = {}

        api.body = ko.observable(body);

        api.isVisible = ko.observable(false)

        api.placement = ko.observable('top');

        return api;
    };
});