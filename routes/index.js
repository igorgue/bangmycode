var codeDb = require('codeDatabase');

module.exports = function(app) {
  app.get('/', function(req, res) {
    // FIXME This is just to test
    codeDb.getCodesByRange(0, -1, function(codes) {
      res.render("index", {results: JSON.parse(codes)});
    });
  });
};
