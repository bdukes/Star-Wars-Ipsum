var express = require('express');
var data = require('./data.js');
var random = require('./random.js');
var termCount = data.terms.length;

var app = express.createServer(express.logger());
app.set('view engine', 'jade');

app.get('/', function (request, response) {
	response.render('index', {paragraphs:[]});
});
app.get('/dislaimer', function (request, response) {
	response.render('disclaimer');
});
app.post('/', function (request, response) {
	var paragraphCount = 5,
	    paragraphLength = 500,
	    paragraphs = [],
	    i, j,
	    paragraph,
	    sentenceLength,
	    term;
	for (i = 0; i < paragraphCount; i++) {
		paragraph = '';
		while (paragraph.length < paragraphLength) {
			sentenceLength = random.getRandomInteger(4, 10);
			for (j = 0; j < sentenceLength; j++) { 
				term = data.terms[random.getRandomInteger(0, termCount)];
				if (j === 0) {
					term = term[0].toUpperCase() + term.slice(1);
				}

				paragraph += term + (j === sentenceLength - 1 ? '. ' : ' ');
			}
		}

		paragraphs.push(paragraph);
	}

	response.render('index', {
        paragraphs:paragraphs
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
