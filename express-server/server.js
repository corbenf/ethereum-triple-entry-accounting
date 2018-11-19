var express = require('express');
var bodyParser = require('body-parser')
var server = express();
var cors = require('cors');
var routes = require('./routes');
var mongodb = require('./db/mongo-connect');

var portNumber = 2720;

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
//Allow access from Angular 6 app running on port 4200
server.use(cors({origin:'http://localhost:4200'}));
//Initialise routes
routes(server);
//Connect to server folder
server.use(express.static(__dirname));
//listen for requests
server.listen(portNumber);
console.log("Express server running on port number:", portNumber);