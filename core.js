'use strict';

exports.version = '0.0.1'

var extend = function (derivedCls, baseCls) {
	for (var propName in baseCls) {
		if (baseCls.hasOwnProperty(propName)) {
			derivedCls[propName] = baseCls[propName];
		}
	}

	function __() {
		this.constructor = derivedCls;
	}

	__.prototype = baseCls.prototype;

	derivedCls.prototype = new __();
	derivedCls.__super = baseCls;
};

exports.extend = extend;
