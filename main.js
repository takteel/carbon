"use strict";

var settings = require('./settings');
var http = require('http');
var express = require('express');
var params = require('express-params');
var path = require('path');
var Planet = require('./planet').Planet;
var contract = require('./contract');

var util = require('util');

var app = express();
params.extend(app);

if (process.argv.length > 2) {
	if (/^\d+$/.test(process.argv[2])) {
		settings.port = parseInt(process.argv[2], 10);
	}
	else {
		console.log('illegal port');
	}
}

var planets = [];

planets.push({ id:123, name:'toto' });

planets.findOne = function (params) {
	var properties = Object.getOwnPropertyNames(params);

	for (var elementIt = 0, elementEnd = this.length; elementIt < elementEnd; ++elementIt) {
		var match = true;
		var element = this[elementIt];

		for (var propertyIt = 0, propertyEnd = properties.length; propertyIt < propertyEnd; ++propertyIt) {
			var propertyName = properties[propertyIt];

			if (!(propertyName in element) || (params[propertyName] !== element[propertyName])) {
				match = false;
				break ;
			}
		}

		if (match) {
			return element;
		}
	}

	return undefined;
};

app.set('port', settings.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.render('index', { title: 'index', routes: app.routes.get });
});

app.get('/planet', function(req, res) {
	res.format({
		'text/plain': function () {
		},
		'text/html': function () {
			res.render('planets-list', { title: 'planets', planets: planets });
		},
		'application/json': function () {
			res.json(planets);
		}
	});
});

app.param(':id', /^\d+$/);
app.get('/planet/:id', function(req, res) {
	var planet = planets.findOne({ id: parseInt(req.params.id[0]) });
	console.log(planet);

	res.format({
		'text/plain': function () {
		},
		'text/html': function () {
			res.render('planet', { title: 'planet', planet: planet });
		},
		'application/json': function () {
			res.json(planets);
		}
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
