var express = require('express'),
	app = express(),
  	swig = require('swig'),
  	people;
var path = require("path");
var oneDay = 86400000;

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
// app.use('/static', express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public'))); 
//app.use(express.static(__dirname + '/public', { maxAge: oneDay }));
//
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

app.get('/', function (req, res) {
  res.render('index', { /* template locals context */ });
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');
