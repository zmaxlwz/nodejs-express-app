var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var app = express();
//var mongodb = require('mongodb');
// Data-parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', './views');

// start endpoints for receiving

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Routing
app.use(express.static('assets'));


app.get('/', function (req, res) {
  //res.render('check', { title: 'Hey', message: 'Hello there!' })
  res.render('connect');
});


app.get('/check', function(req, res){

	var dbname = 'house';

	res.render('check', { 
			title: 'Hey', 
			message: 'Hello there!', 
			helpers: {
				getTable: function(){
					//return 'foo.';	
					
					if(dbname == 'house'){
						return Handlebars.compile('<p>real_estate</p>');
							
					}
					else{
						return Handlebars.compile('<p>sdss_random_sample</p>');
								
					}
					
				}
			}
	});

});


app.post('/checklogin', function(req, res){
	const myhost = req.body.myhost
	, myport = req.body.myport
    , myusername = req.body.myusername
	, mypassword = req.body.mypassword
	, myscenario = req.body.myscenario
	, mydb = req.body.mydb;

	console.log(myhost);
	console.log(myport);
	console.log(myusername);
	console.log(mypassword);
	console.log(myscenario);
	console.log(mydb);

	//res.send('get it.');
	res.render('checklogin', {
		myhost: myhost, 
		myport: myport, 
		myusername: myusername, 
		mypassword: mypassword, 
		myscenario: myscenario, 
		mydb: mydb,
		helpers: {
				getTable: function(){
					//return 'foo.';	
					
					if(mydb == 'housing'){
						return 'real_estate';
							
					}
					else{
						return 'sdss_random_sample';
								
					}
					
				}
		}
	});
});

app.post('/attribute_select', function(req, res){
	const table_select = req.body.table_select;
	console.log(table_select);

	res.send('get it.');

});

app.listen(8000, function () {
 console.log("Server is now running on port 8000...");
});

