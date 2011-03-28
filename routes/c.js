var db = require('codeDatabase');

module.exports = function(app) {
  app.get('/c/:id', function(req, res) {
    db.getCode(req.params.id, function(reply) {
      res.send(reply);
    });
  });

  app.post('/c', function(req, res) {
    db.createCode(req.body.title, req.body.content, function(reply) {
      res.send(reply);
    });
  });

  app.del('/c/:id', function(req, res) {
    db.deleteCode(req.query.deleteKey, function(reply) {
      res.send(reply);
    });
  });
};
