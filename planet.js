"use strict";

function type(obj){
	console.log(obj.constructor.toString());
    return Object.prototype.toString.call(obj).slice(8, -1);
}

var MakeContracts = function (cls) {
	var util = require('util');

	var newCls = undefined;
	if (typeof cls === 'function') {
		console.log('patching', cls);
		newCls = function () {
			console.log('-------------------------');
			console.log('preconditions testing');
			console.log('invariants testing');
			var check, index, value, _i, _len;
			for (var index = 0, _len = arguments.length; index < _len; ++index) {
				console.log(index, arguments[index]);
				value = arguments[index];
				check = cls[index];
				if (check) {
					check(value);
				}
			}

			var result = cls.apply(null, arguments);

			console.log('invariants testing');
			console.log('postconditions testing');
			console.log('-------------------------');
			
			return result;
		};
	}

	for (var i in cls) {
		console.log('i:', i);
		console.log('cls[i]:', cls[i]);
	}

	console.log('make contracts class', util.inspect(cls));
	console.log('make contracts class.prototype', util.inspect(cls.prototype));
	console.log('make contracts class.prototype.constructor', util.inspect(cls.prototype.constructor));

	return newCls;
}

function isNumber(param) {
	if (typeof param !== 'number') {
		throw RangeError('parameter is not a number');
	}
}

var ContractObject = (function () {
	function ContractObject(p0) {
		console.log('ContractObject');
	}
	ContractObject.preconditions = [isNumber];
	ContractObject.postconditions = [isNumber];
	ContractObject.invariants = [isNumber];

	ContractObject.prototype.test = function (p0, p1) {

	};

	ContractObject.prototype.test.preconditions = [];
	ContractObject.prototype.test.postconditions = [];

	return MakeContracts(ContractObject);
})();

var r = new ContractObject(42);
var s = new ContractObject('42');
var t = new ContractObject('test');

var Planet = (function () {
	function Planet(params) {
		if (params && params.srcObject !== undefined) {
			var srcObject = params.srcObject;

			while (srcObject.version !== Planet.version) {
				srcObject = Planet.versionUpgrade[srcObject.version].upgrade(srcObject);
			}

			this.name = srcObject.name;
			this.coordinates = srcObject.coordinates;
			this.description = srcObject.description;
		}
		else {
			this.name = "toto";
			this.coordinates = [0, 0];
			this.description = "qsdqsd qsdqsd";
		}
	}

	Planet.prototype.toJSON = function () {
		console.log('-----------------');
		for (var i in this) {
			console.log(i);
		}
		console.log('-----------------');
		return {
			type: type(this),
			version: Planet.version,
			name: this.name,
			coordinates: this.coordinates,
			description: this.description
		};
	};

	Planet.version = "0.0.4";
	Planet.versionUpgrade = {
		"0.0.1" : {
			upgrade : function (obj) {
				return {
					version: "0.0.2",
					name: obj.name,
					coordinates: [0, 0]
				};
			}
		},
		"0.0.2" : {
			upgrade : function (obj) {
				return {
					version: "0.0.4",
					name: obj.name,
					coordinates: obj.coordinates,
					description: "new description"
				};
			}
		},
	};

	return Planet;
})();

exports.Planet = Planet;
