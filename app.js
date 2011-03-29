require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var express = require('express');
var app = express.createServer();

// Middleware
app.use(express.bodyParser());

// Routes
require('routes/index')(app);

// Templates
app.set( "view engine", "ejs" );
app.register(".ejs", require("ejs"));

// API routes
require('routes/api/c')(app);
require('routes/api/comment')(app);

// Development config
app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Deployment config
app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

// Running the app
if (!module.parent) {
  app.listen(3000);
  console.log("Server running at http://localhost:3000");
}
