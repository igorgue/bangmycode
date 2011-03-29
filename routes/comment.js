var codeDb = require('codeDatabase');
var commentDb = require('commentDatabase');

module.exports = function(app) {
  app.post('/c/:id/comment', function(req, res) {
    commentDb.createComment(req.params.id, req.body, function(reply) {
      var result = JSON.parse(reply);
      result['codeId'] = req.params.id;

      res.render("new_comment_created", result);
    });
  });

  app.get('/c/:codeId/comment/:commentId', function(req, res) {
    commentDb.getComment(req.params.commentId, function(reply) {
      var results = JSON.parse(reply);
      results['codeId'] = req.params.codeId;

      res.render("show_comment", results);
    });
  });
};
