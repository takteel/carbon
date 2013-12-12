"use strict";

function type(obj){
	console.log(obj.constructor.toString());
    return Object.prototype.toString.call(obj).slice(8, -1);
}

var MakeContracts = function (cls) {
	var util = require('util');

	console.log('make contracts class', util.inspect(cls));
	console.log('make contracts class.prototype', util.inspect(cls.prototype));

	return cls;
}

var ContractObject = (function () {
	function ContractObject(p0) {
	}
	ContractObject.preconditions = [];

	ContractObject.prototype.test = function (p0, p1) {

	};

	ContractObject.prototype.test.preconditions = [];
	ContractObject.prototype.test.postconditions = [];

	return MakeContracts(ContractObject);
})();

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
