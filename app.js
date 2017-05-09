'use strict'

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');


app.set('port', (process.env.PORT || 5000));
// const port = process.env.PORT ||  5000;
// app.use(express.static(__dirname+'/public'));
// app.use('/node_modules', express.static(__dirname +'/node_modules'));

//Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


//Listen for requests
const server = app.listen(app.get('port'), ()=>{
	const port = server.address().port;
	console.log('Magic happens on port ' + port);	
});




// //For avoidong Heroku $PORT error
// app.get('/', function(request, response) {
//     var result = 'App is running'
//     response.send(result);
// }).listen(app.get('port'), function() {
//     console.log('App is running, server is listening on port ', app.get('port'));
// });