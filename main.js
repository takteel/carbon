"use strict";

var settings = require('./settings');

var http = require('http');
var express = require('express');
var path = require('path');

var app = express();

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

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
