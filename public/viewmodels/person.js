define([ 
	'/knockout/build/output/knockout-latest.debug.js',
	'/marked/lib/marked.js'
], function(ko, marked) {
    return function newPerson(opts) {

    	var api = {}

        api.type = ko.observable(opts.type);

        api.imageSrc = ko.observable(opts.imageSrc)

        api.description = ko.computed(function() {
        	return marked(opts.description)
        })

        return api;
    };
});