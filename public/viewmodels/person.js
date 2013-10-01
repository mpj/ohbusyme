define([ 
	'/knockout/build/output/knockout-latest.debug.js',
    '/marked/lib/marked.js',
], function(ko, marked) {
    return function newPerson(parent, eventBus) {

    	var api = {}

        api.look = ko.observable()
        api.imageSrc = ko.observable()

        api.clicked = function() {
            parent.clicked()
        }

        api.parse = function(opts) {
            
            if (!opts.look)
                throw new Error('Property look was not provided.')
            if (!opts.imageSrc)
                throw new Error('Property imageSrc was not provided.')

            api.look(opts.look)
            api.imageSrc(opts.imageSrc)
        }

        return api;
    };
});