var express = require('express');
var data = require('./data.js');

var app = express.createServer(express.logger());
app.set('view engine', 'jade');

app.get('/', function (request, response) {
	response.render('index');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
