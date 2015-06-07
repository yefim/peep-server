var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var api = require('./routes/api');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', api);

app.listen(3000, function() {
  console.log('Listening at http://localhost:3000/');
});
