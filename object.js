"use strict";

exports.version = '0.0.1';

exports.extensions = {
	'getOwnPropertyNames' : function () {
		return Object.getOwnPropertyNames(this);
	}
};

exports.extend = function extend (cls) {
	for (var methodNames in exports.extensions) {
		if (cls.prototype[methodNames] === undefined) {
			cls.prototype[methodNames] = exports.extensions[methodNames];
		}
	}
};
