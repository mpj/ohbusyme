define([ '/knockout/build/output/knockout-latest.debug.js'], function(ko) {
    return function newSegment(opts) {

    	var api = {}

        api.type = ko.observable(opts.type);

        return api;
    };
});