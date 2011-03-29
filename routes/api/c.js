var db = require('codeDatabase');

module.exports = function(app) {
  app.get('/api/c/:id', function(req, res) {
    db.getCode(req.params.id, function(reply) {
      res.send(reply);
    });
  });

  app.post('/api/c', function(req, res) {
    db.createCode(req.body, function(reply) {
      res.send(reply);
    });
  });

  app.del('/api/c/:id', function(req, res) {
    db.deleteCode(req.query.deleteKey, function(reply) {
      res.send(reply);
    });
  });
};
