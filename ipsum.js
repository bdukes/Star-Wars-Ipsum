var express = require('express');
var data = require('./data.js');
var random = require('./random.js');
var termCount = data.terms.length;

var app = express.createServer(express.logger());
app.set('view engine', 'jade');

app.get('/', function (request, response) {
	response.render('index', {paragraphs:[]});
});
app.post('/', function (request, response) {
	var paragraphs = ['', '', '', '', ''];
	for (var i = 0, j = 0; i < 5; i++) {
		while (paragraphs[i].length < 500) {
			paragraphs[i] += data.terms[j++] + ' ';
		}
	}

	response.render('index', {paragraphs:paragraphs});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
