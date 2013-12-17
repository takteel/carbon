'use strict';

var urls = require('./urls');

var defaultSetup = {
	namespace: '/account'
};

function initialize(app, setup) {
	var finalSetup = defaultSetup;

	if (setup) {
		for (var propName in setup) {
			finalSetup[propName] = setup[propName];
		}
	}

	app.namespace(finalSetup.namespace, function () {
		for (var i = 0, l = urls.length; i < l; ++i) {
			var url = urls[i];

			if (url.parameters) {
				var parameters = url.parameters;
				for (var parameterName in parameters) {
					app.param(parameterName, parameters[parameterName]);
				}
			}

			if (url.get) {
				app.get(url.pattern, url.get);
			}
		}
	});
}

module.exports.initialize = initialize;
module.exports.defaultSetup = defaultSetup;
