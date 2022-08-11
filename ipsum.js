var express = require('express'),
    data = require('./data.js'),
    random = require('./random.js'),
    pub_dir = __dirname + '/public',
    levels = {
        padawan: {
                     terms: data.commonTerms,
                     termCount: data.commonTerms.length
        },
        'grand-master': {
            terms: data.extendedTerms,
            termCount: data.extendedTerms.length
        }
    },
    defaultIndexOptions = {
        pageId: 'index',
        paragraphs: [], 
        paragraphCount: 5, 
        startWith: true,
        termLevel: 'padawan',
        debugMesasge: ''
    },
    app = express.createServer(express.logger());
app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
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
app.get('/disclaimer', function (request, response) {
	response.render('disclaimer', {
        pageId: 'disclaimer',
        debugMesasge: ''
    });
});
app.get('/', function (request, response) {
	response.render('index', defaultIndexOptions);
});
app.post('/', function (request, response) {
	var paragraphCount = parseInt(request.body['paragraph-count'], 10) || defaultIndexOptions.paragraphCount,
        startWith = request.body['start-with'],
        level = levels[request.body['term-level']] || levels[defaultIndexOptions.termLevel],
	    paragraphLength = 500,
	    paragraphs = [],
	    i, j,
	    paragraph,
	    sentenceLength,
	    term;
	for (i = 0; i < paragraphCount; i++) {
		paragraph = startWith ? 'Lieutenant ipsum where no one sit amet has gone before ' : '';
		while (paragraph.length < paragraphLength) {
			sentenceLength = startWith ? 10 : random.getRandomInteger(4, 10);
			for (j = 0; j < sentenceLength; j++) { 
				term = level.terms[random.getRandomInteger(0, level.termCount)];
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
        pageId: 'index',
        paragraphs: paragraphs,
        paragraphCount: paragraphCount,
        startWith: request.body['start-with'],
        termLevel: request.body['term-level'],
       debugMessage: 'start-with = ' + request.body['start-with'] 
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Listening on " + port);
});
