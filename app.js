/**
 * Created by awunnenb on 07.06.14.
 */

// Module
var express = require('express');
var app = express();
var units = require('./routes/units.js');
var words = require('./routes/words.js');
var http = require('http');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());         // pull information from html in POST
app.use(methodOverride()); // simulate DELETE and PUT
app.use(express.static(__dirname + '/public'));


var env = process.env.NODE_ENV || 'production';
if ('development' == env) {
    var morgan = require('morgan'); // log every request to the console
    var errorHandler = require('errorhandler');
    app.use(morgan('dev'));
    app.use(errorHandler());
}

// Routes
app.get('/', units.index);
app.get('/home', units.index);
app.get('/new', units.new);
app.get('/units/edit/:id', units.edit);
app.get('/units/words/:id', units.words);
app.get('/delete/:id', units.delete);
app.get('/done/:id', units.done);
app.post('/save/:id?', units.save);
app.post('/remove/:id', units.remove);
app.get('/words', words.index);
app.get('/words/new', words.new);
app.get('/words/edit/:id', words.edit);
app.get('/words/delete/:id', words.delete);
app.get('/words/done/:id', words.done);
app.post('/words/save/:id?', words.save);
app.post('/words/remove/:id', words.remove);

// Server
http.createServer(app).listen(app.get('port'), function(){
    console.log('App Started at Port '+ app.get('port'));
    console.log('URL: http://localhost:'+ app.get('port'));

});
