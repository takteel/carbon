'use strict';

module.exports.index = function (req, res, next) {
	res.send('account index');
};

module.exports.info = function (req, res, next) {
	res.send('account info: ' + req.params['accountId']);
};
