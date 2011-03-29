var db = require('commentDatabase');

module.exports = function(app) {
  app.get('/api/c/:id/comment', function(req, res) {
    db.getAllComments(req.params.id, function(reply) {
      res.send(reply);
    });
  });

  app.post('/api/c/:id/comment', function(req, res) {
    db.createComment(req.params.id, req.body, function(reply) {
      res.send(reply);
    });
  });

  app.get('/api/c/:id/comment/:commentId', function(req, res) {
    db.getComment(req.params.commentId, function(reply) {
      res.send(reply);
    });
  });

  app.del('/api/c/:id/comment/:commentId', function(req, res) {
    db.deleteComment(req.query.deleteKey, function(reply) {
      res.send(reply);
    });
  });
};
