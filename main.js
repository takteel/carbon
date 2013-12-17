"use strict";

var settings = require('./settings');
var http = require('http');
var express = require('express');

var express_params = require('express-params');
var express_namespace = require('express-namespace');

var app = express();

express_params.extend(app);

var path = require('path');

/*
var Planet = require('./planet').Planet;
var contract = require('./contract');
*/

var util = require('util');

if (process.argv.length > 2) {
	if (/^\d+$/.test(process.argv[2])) {
		settings.port = parseInt(process.argv[2], 10);
	}
	else {
		console.log('illegal port');
	}
}

var planets = [];

planets.push({
	id: 123,
	name: 'PF-346'
});

planets.findOne = function (params) {
	var properties = Object.getOwnPropertyNames(params);

	for (var elementIt = 0, elementEnd = this.length; elementIt < elementEnd; ++elementIt) {
		var match = true;
		var element = this[elementIt];

		for (var propertyIt = 0, propertyEnd = properties.length; propertyIt < propertyEnd; ++propertyIt) {
			var propertyName = properties[propertyIt];

			if (!(propertyName in element) || (params[propertyName] !== element[propertyName])) {
				console.log('FAILURE', element, propertyName);
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

var OBJECT_ID = /^[0-9a-f]{24}$/;
var OBJECT_NAME = /^[a-zA-Z][a-zA-Z0-9\-]{3,14}[a-zA-Z0-9]$/;

app.param('planetId', OBJECT_ID);
app.param('planetName', OBJECT_NAME);

app.get('/planets/:planetName/', function (req, res) {
	var planet = planets.findOne({ name: req.params.planetName[0] });

	if (!planet) {
		throw Error('Can not find object ' + req.params.planetName);
	}

	res.send('GET planet ' + req.params.planetName);
});

app.namespace('/api/planets', function () {
	app.get('/', function (req, res) {
		// res.send(util.inspect(req));
		res.send('GET all planets');
	});

	app.namespace('/:planetName', function () {
		app.get('/', function (req, res, next) {
			// res.send(util.inspect(req));
			res.send('GET planet ' + req.params.planetName);
		});
	})
});

/*
app.param('id', /^\d+$/);
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
app.get('/planet/', function(req, res) {
	res.format({
		'text/plain': function () {
		},
		'text/html': function () {
			console.log(req.params);
			res.render('planets-list', { title: 'planets', planets: planets });
		},
		'application/json': function () {
			res.json(planets);
		}
	});
});
*/

/*
var CHARACTER_NAME = /^[A-Z][a-zA-Z0-9]{4,14}[a-zA-Z0-9]$/;

app.param('characterName', CHARACTER_NAME);

app.namespace('/character/', function () {
	app.get(':characterName/', function (req, res) {
		res.send('GET character ' + req.params.characterName);
	});
	app.del(':characterName/', function (req, res){
		res.send('DELETE character ' + req.params.characterName);
	});
});
*/

/*
var GALAXY_NAME = /^[A-Z1-9][A-Z1-9\-]{3,14}[A-Z1-9]$/;
var REGION_NAME = /^[A-Z1-9][A-Z1-9\-]{3,14}[A-Z1-9]$/;

app.param('galaxyName', GALAXY_NAME);
app.param('regionName', REGION_NAME);

app.namespace('/api', function () {
	app.namespace('/galaxies', function () {
		app.get('/', function (req, res) {
			res.send('GET all galaxies');
		});

		app.namespace('/:galaxyName', function () {
			app.get('/', function (req, res) {
				res.send('GET galaxy by name ' + req.params.galaxyName[0]);
			});

			app.namespace('/regions', function () {
				app.get('/', function (req, res) {
					res.send('GET galaxy\'s regions for ' + req.params.galaxyName[0]);
				});

				app.namespace('/:regionName', function () {
					app.get('/', function (req, res) {
						res.send('GET region by name ' + req.params.regionName[0] + ' in galaxy ' + req.params.galaxyName[0]);
					});
				});
			});
		});
	});
});
*/

/*
app.namespace('/account/:id', function () {
	app.get('/', function(req, res) {
		res.send('GET account ' + req.params.id);
	});

	app.get('/edit', function(req, res){
		res.send('GET forum ' + req.params.id + ' edit page');
	});

	app.del('/', function(req, res){
		res.send('DELETE account ' + req.params.id);
	});
});
*/
/*
var account = require('./lib/account');

account.initialize(app);
*/
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
