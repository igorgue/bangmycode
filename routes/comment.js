var db = require('codeDatabase');

module.exports = function(app) {
  app.get('/c/:id/comment', function(req, res) {
    res.send("GET /c/" + req.params.id + "/comment");
  });

  app.post('/c/:id/comment', function(req, res) {
    res.send("POST /c/" + req.params.id + "/comment");
  });

  app.get('/c/:id/comment/:commentId', function(req, res) {
    res.send("GET /c/" + req.params.id + "/comment/" + req.params.commentId);
  });

  app.del('/c/:id/comment/:commentId', function(req, res) {
    res.send("DELETE /c/" + req.params.id + "/comment/" + req.params.commentId);
  });
};
