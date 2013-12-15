'use strict';

var extend = require('./core').extend;

exports.version = '0.0.1';

var ContractViolationError = (function (_super) {
	extend(ContractViolationError, _super);

	function ContractViolationError(message) {
		this.name = "ContractViolationError";
		this.message = message || "No message provided";
	}

	return ContractViolationError;
})(Error);


var PreconditionViolationError = (function (_super) {
	extend(PreconditionViolationError, _super);

	function PreconditionViolationError(message) {

	}

	return PreconditionViolationError;
})(ContractViolationError);

function isType(type) {
	return function (x) {
		return typeof (x) === type;
	}
}

function isInteger(x) {
	return typeof (x) === 'number' && (~~x === x);
}

function isFloat(x) {
	return typeof (x) === 'number';
}

function isNumber(x) {
	return typeof (x) === 'number';
}

function lessThan(max) {
	return function lessThan (x) {
		return x < max;
	}
}

function lessThanEqual(max) {
	return function lessThanEqual (x) {
		return x <= max;
	}
}

function greaterThan(min) {
	return function greaterThan (x) {
		return x > min;
	}
}

function greaterThanEqual(min) {
	return function greaterThanEqual (x) {
		return x >= min;
	}
}

function testFunction(p0, p1) {
	console.log('testFunction', p0);
	console.log('testFunction', p1);
}

testFunction.params = [
	{ name: 'p0', checks: [ isInteger, greaterThan(0), lessThan(11) ] }
];

testFunction.return = {

};

function patchFunction(fn) {
	if (typeof fn !== 'function') {
		throw TypeError('fn is not a function');
	}

	var checkParameters = undefined;
	var checkReturn = undefined;

	if (fn.hasOwnProperty('params')) {
		checkParameters = function (args) {
			if (args.length !== fn.length) {
				throw Error('function received an unexpected number of arguments');
			}

			for (var paramIdx in fn.params) {
				var paramInfo = fn.params[paramIdx];
				
				if (paramInfo.checks && paramInfo.checks.length > 0) {
					console.log('checking', paramInfo.name);
					console.log('value', args[paramIdx]);

					for (var checkIdx in paramInfo.checks) {
						var check = paramInfo.checks[checkIdx];

						console.log(check);

						if (!check(args[paramIdx])) {
							console.log(paramIdx, paramInfo.name, 'failed');
						}
					}
				}
			}
		}
	}

	if (fn.hasOwnProperty('return')) {
		console.log('adding some return check to', fn);
	}

	var patched = function () {
		if (checkParameters) {
			checkParameters(arguments);
		}

		return fn.apply(null, arguments);
	}

	return patched;
}

console.log(testFunction.toString());
testFunction = patchFunction(testFunction);
console.log(testFunction.toString());
testFunction(10, 15);

/*
ou 

function test2(p0, p1) {
	// describe(p0, isNumber, isInRange(0, 1))
	// describe(p1, isOptional, isString, maxLength(255))
};
contracts(test2);
*/
/*
var ContractViolationError = (function () {
	extend(ContractViolationError, Error);

	function ContractViolationError() {
		Error(this, 'yeah');
	}

	return ContractViolationError;
})();

var error = new Error('test');
var test = new ContractViolationError();

console.log('test instanceof Error', test instanceof Error);
console.log('test instanceof ContractViolationError', test instanceof ContractViolationError);
console.log(error.toString());
console.log(error.message);

console.log(test.toString());
console.log(test.message);
*/
