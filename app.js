require.paths.unshift(__dirname, '/lib');
require.paths.unshift(__dirname);

var app = require('express').createServer();

// Routes
require('./routes/index')(app);
require('./routes/c')(app);
require('./routes/comment')(app);

if (!module.parent) {
  app.listen(3000);
  console.log("Server running at http://localhost:3000");
}
