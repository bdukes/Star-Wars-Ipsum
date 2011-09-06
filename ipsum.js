var express = require('express'),
    less = require('less'),
    data = require('./data.js'),
    random = require('./random.js'),
    pub_dir = __dirname + '/public',
    termCount = data.terms.length,
    app = express.createServer(express.logger());
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.compiler({ src: pub_dir, enable: ['less']}));
});
app.configure('development', function () {
    app.use(express.static(pub_dir));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function () {
    var oneYear = 31557600000;
    app.use(express.static(pub_dir, { maxAge: oneYear }));
    app.use(express.errorHandler());
});
/*
app.get('/*.css', function (request, response) {
    less.render('body { background-color: #fff;}', function (error, tree) {
        tree.toCSS({ compress: true });
    });           
});
*/
app.get('/disclaimer', function (request, response) {
	response.render('disclaimer');
});
app.get('/', function (request, response) {
	response.render('index', {paragraphs:[], paragraphCount:5, startWith:true});
});
app.post('/', function (request, response) {
	var paragraphCount = parseInt(request.body['paragraph-count'], 10) || 5,
        startWith = request.body['start-with'],
	    paragraphLength = 500,
	    paragraphs = [],
	    i, j,
	    paragraph,
	    sentenceLength,
	    term;
	for (i = 0; i < paragraphCount; i++) {
		paragraph = startWith ? 'Lucas ipsum dolor sit amet ' : '';
		while (paragraph.length < paragraphLength) {
			sentenceLength = startWith ? 10 : random.getRandomInteger(4, 10);
			for (j = 0; j < sentenceLength; j++) { 
				term = data.terms[random.getRandomInteger(0, termCount)];
				if (j === 0 && !startWith) {
					term = term[0].toUpperCase() + term.slice(1);
				}

				paragraph += term + (j === sentenceLength - 1 ? '. ' : ' ');
			}

            startWith = false;
		}

		paragraphs.push(paragraph);
	}

	response.render('index', {
        paragraphs:paragraphs,
        paragraphCount: paragraphCount,
        startWith: request.body['start-with']
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
