'use strict';

var views = require('./views');

var urls = [
	{
		name: 'index',
		pattern: '/',
		get: views.index
	},
	{
		name: 'info',
		parameters: {
			'accountId': /^[a-zA-Z]+[a-zA-Z0-9_]+[a-zA-Z0-9]+$/
		},
		pattern: '/:accountId',
		get: views.info
	}
];

module.exports = urls
