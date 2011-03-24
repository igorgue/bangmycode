require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var express = require('express');
var app = express.createServer();

var db = require('codeDatabase');

// Middleware
app.use(express.bodyParser());

// Routes
require('./routes/index')(app);
require('./routes/c')(app);
require('./routes/comment')(app);

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

if (!module.parent) {
  app.listen(3000);
  console.log("Server running at http://localhost:3000");
}
