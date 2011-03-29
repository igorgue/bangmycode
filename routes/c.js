var codeDb = require('codeDatabase');
var commentDb = require('commentDatabase');

module.exports = function(app) {
  app.post('/c', function(req, res) {
    // Fixing the type (god I'm lazy
    var newBody = req.body;
    newBody.type = newBody.type.slice(1); // removing the 1st char since it's a dot

    codeDb.createCode(req.body, function(reply) {
      res.render("new_code_created", JSON.parse(reply));
    });
  });

  app.get('/c/new', function(req, res) {
    res.render("new_code");
  });

  app.get('/c/:id', function(req, res) {
    codeDb.getCode(req.params.id, function(reply) {
      var code = JSON.parse(reply);

      commentDb.getAllComments(code.id, function(reply) {
        var comments = JSON.parse(reply);

        res.render("show_code", {code: code, comments: comments});
      });
    });
  });

  app.post('/c/:id/comment', function(req, res) {
    commentDb.createComment(req.params.id, req.body, function(reply) {
      var result = JSON.parse(reply);
      result['codeId'] = req.params.id;

      res.render("new_comment_created", result);
    });
  });
};
