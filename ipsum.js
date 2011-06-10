var express = require('express');
var data = require('./data.js');

var app = express.createServer(express.logger());

app.get('/', function (request, response) {
	response.send('<h1>Hello world from Star Wars Ipsum</h1><p>' + data.terms[0] + '</p>');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
