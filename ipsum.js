var express = require('express');
var data = require('./data.js');

var app = express.createServer(express.logger());

app.get('/', function (request, response) {
	response.write('<h1>Hello world from Star Wars Ipsum</h1>');
	response.write('<p>');
	
	var ipsumText = '', i = 0;
	while (ipsumText.length < 500) {
		ipsumText += data.terms[i++];
	}
	
	response.send(ipsumText + '</p>');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
