module.exports = function(app) {
  app.get('/c/:id', function(req, res) {
    res.send("GET /c/" + req.params.id);
  });

  app.post('/c', function(req, res) {
    res.send("POST /c");
  });

  app.del('/c/:id', function(req, res) {
    res.send("DELETE /c/" + req.params.id);
  });
};
