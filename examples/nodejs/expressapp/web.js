// Express initialization
var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/comp20'; // comp20 is the name of the database we are using in MongoDB
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>Hi!</p>');
});

app.get('/data.json', function(request, response) {
  var username = request.query.username; // dealing with a query variable
  // Example: on your web browser, go to http://[domain here, e.g., localhost]:3000/data.json?username=batman
  console.log("I see a username: " + username)
  response.set('Content-Type', 'text/json');
  response.send('{"status":"good"}');
});

app.get('/fool', function(request, response) {
  response.set('Content-Type', 'text/html');
  response.send(500, 'Something broke!');
});

app.post('/play', function(request, response) {
  // Send data to this web application via:
  //   curl --data "playdata=blah..." http://[domain here, e.g., localhost]:3000/play
  userinput = request.body.playdata;
  console.log("Someone sent me some data: " + userinput);

  // Let's insert whatever was sent to this web application (read: NSFW) to a collection named 'abyss' on MongoDB

  // 1. Specify a collection to use
  db.collection('abyss', function(error, collection) {

    // 2. Put data into the collectiontheDocument = {"dump":userinput};
    collection.insert(theDocument, function(error, saved) {

      // What you really want to do here: if there was an error inserting the data into the collection in MongoDB, send an error. Otherwise, send OK (e.g., 200 status code)
      response.send(200);
    });
  });
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
