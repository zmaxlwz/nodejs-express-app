var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var app = express();
//var mongodb = require('mongodb');
// Data-parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', './views');

// start endpoints for receiving

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Routing
app.use(express.static('assets'));

//var count = 0;

app.get('/', function (req, res) {
  //res.render('check', { title: 'Hey', message: 'Hello there!' })
  //console.log(count);
  //count++;

  res.render('connect');
});

app.post('/', function(req, res){
	res.render('connect');
});


app.get('/check', function(req, res){

	var dbname = 'housing';

	res.render('check', { 
		title: 'Hey', 
		message: 'Hello there!', 
		hasPeople: false,
		hasOnePeople: true,
		objectArray: [{price: 12, weight: 10}, {price: 14, weight: 8}],
		helpers: {
			getTable: function(){
					//return 'foo.';	
					
					if(dbname == 'housing'){
						//return Handlebars.compile('<p>real_estate</p>');
						return 	'real_estate';
					}
					else{
						//return Handlebars.compile('<p>sdss_random_sample</p>');
						return 'sdss_random_sample';		
					}
					
				}
			}
		});

});

var myhost, myport, myusername, mypassword, myscenario, mydb;
//this is pg-promise module
//use this module to connect to PostgreSQL database
var pgp = require('pg-promise')()
//database configuration object and db object
var cn, db; 

app.post('/checklogin', function(req, res){
	myhost = req.body.myhost
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

	//console.log(count);
  	//count++;

  	cn = {
		host: myhost,
		port: myport,
		database: mydb,
		user: myusername,
		password: mypassword
	};

	db = pgp(cn);


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

var table_select;

app.post('/attribute_select', function(req, res){
	table_select = req.body.table_select;
	console.log(table_select);
	console.log(myhost);

	//console.log(count);
  	//count++;

	/*
	db.one("select * from $1~ where id=$2", [table_select, 154370])
    .then(function (data) {
        // success;
        console.log(data);
    })
    .catch(function (error) {
        // error;
        console.log(error);
    });
    */


    if(table_select == 'sdss_random_sample'){
    	db.any("select name as col_name, type, description \
    		from attribute_popularity \
    		order by times desc")
    	.then(function (data) {
        	// success;
        	console.log(data);
        	//res.send('sdss, get it.');

        	res.render('attribute_select', {
        		myhost: myhost, 
        		myport: myport, 
        		myusername: myusername, 
        		mypassword: mypassword, 
        		myscenario: myscenario, 
        		mydb: mydb,
        		table_select: table_select,
        		isScenario4: myscenario == 'Scenario 4',
        		isScenario5: myscenario == 'Scenario 5',
        		isTableRealEstate: table_select == 'real_estate',
        		isTableSDSS: table_select == 'sdss_random_sample',
        		attr_data: data
        		
			});

        })
    	.catch(function (error) {
        	// error;
        	console.log(error);
        });  
    }
    else{
    	db.any("SELECT c.column_name as col_name,pgd.description as col_type \
    		FROM pg_catalog.pg_statio_all_tables as st \
    		inner join pg_catalog.pg_description pgd on (pgd.objoid=st.relid) \
    		inner join information_schema.columns c on (pgd.objsubid=c.ordinal_position \
    		and  c.table_schema=st.schemaname and c.table_name=$1)", [table_select])
    	.then(function (data) {
        	// success;
        	console.log(data);

        	//res.send('real_estate, get it.');


        	res.render('attribute_select', {
        		myhost: myhost, 
        		myport: myport, 
        		myusername: myusername, 
        		mypassword: mypassword, 
        		myscenario: myscenario, 
        		mydb: mydb,
        		table_select: table_select,
        		isScenario4: myscenario == 'Scenario 4',
        		isScenario5: myscenario == 'Scenario 5',
        		isTableRealEstate: table_select == 'real_estate',
        		isTableSDSS: table_select == 'sdss_random_sample',
        		attr_data: data
        		
			});
        })
    	.catch(function (error) {
        	// error;
        	console.log(error);
        }); 	
    }





});

app.post('/histogram', function(req, res){

	console.log('inside histogram...')
	
	console.log(req.body);

	if(req.body.hasOwnProperty('reset')){
		//'reset' button is clicked		
		res.render('connect');
	}
	else{
		//'confirm' button is clicked
		console.log(req.body.target_query);
		console.log(req.body.check_list);

		//res.send('get it.');	

		res.render('histogram', {
        		myusername: myusername, 
        		isScenario4: myscenario == 'Scenario 4',
        		isScenario5: myscenario == 'Scenario 5',
        		notScenario2: myscenario != 'Scenario 2',
        		realEstateScenario2: table_select == 'real_estate' && myscenario == 'Scenario 2',
        		isTableRealEstate: table_select == 'real_estate',
        		isTableSDSS: table_select == 'sdss_random_sample',
        		target_query: req.body.target_query,
        		check_list: req.body.check_list
        		
		});
	}
	
});

app.listen(8000, function () {
	console.log("Server is now running on port 8000...");
});

