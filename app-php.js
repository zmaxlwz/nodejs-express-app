/*
	this program tries to parse and execute PHP files using node.js directly

*/

var express = require('express');
var app = express();

// must specify options hash even if no options provided!
var phpExpress = require('php-express')({
 
  // assumes php is in your PATH
  binPath: '/usr/bin/php'
});

// set view engine to php-express
app.set('views', './views');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
 
app.use(express.static('assets'));

// routing all .php file to php-express
app.all(/.+\.php$/, phpExpress.router);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('PHPExpress app listening at http://%s:%s', host, port);
});
