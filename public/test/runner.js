// Configure RequireJS
require.config({
  urlArgs: "v="+(new Date()).getTime(),
  paths: {
        "moment": "/moment/moment",
    }
});

// Require libraries
require(['require', '/chai/chai.js', '/mocha/mocha.js'], function(require,chai){

  // Chai
  assert = chai.assert;
  should = chai.should();
  expect = chai.expect;

  // Mocha
  mocha.setup('bdd');

  // Require base tests before starting
  require([
  	'/test/overview.js',
  	], function(){
    // Start runner
    mocha.run();
  });

});


