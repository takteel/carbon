"use strict";

var settings = require('./settings');
var Planet = require('./planet').Planet;

var oldPlanet = {
	version: "0.0.1",
	name:"titi"
};

var newPlanet = new Planet();
var newPlanetFromOld = new Planet({srcObject:oldPlanet});
console.log("new", newPlanet);
console.log("old", newPlanetFromOld);
console.log(JSON.stringify(newPlanet));
console.log(JSON.stringify(newPlanetFromOld));

var http = require('http');
var express = require('express');
var params = require('express-params');
var path = require('path');

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

app.param(':id', /^\d+$/);
app.get('/planet/:id', function(req, res) {
	res.render('planet', { title: 'planet', id: req.params.id });
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
