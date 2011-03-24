require.paths.unshift(__dirname + '/hashlib');
require.paths.unshift(__dirname);

var redis = require('redis'),
    client = redis.createClient();

//redis.debug_mode = true; // XXX Use for debugging

var hashlib = require('hashlib');
var hashSeed = "it's friday friday"; // You can change this if you want to
var expire = 3600; // An hour in seconds

// Error catching
client.on('error', function(err) {
  console.log("Error " + err);
});

/*
 * Craetes a code snippet
 */
function createCode(title, content, callback) {
  client.incr("global:codeId", function(err, reply) {
    var id = reply.toString();

    // Sets the object
    var createdAt = Date.now();

    client.set("code:" + id, JSON.stringify({title: title, createdAt: createdAt, content: content}));

    // Create the delete hash
    var deleteKey = hashlib.sha1(hashSeed + id + createdAt);
    client.set("code:delete:" + deleteKey, id);
    client.expire("code:delete:" + deleteKey, expire);

    callback(JSON.stringify({id: id, deleteKey: deleteKey}));
  });
}

/*
 * Gets a code snippet
 */
function getCode(id, callback) {
  client.exists("code:" + id, function(err, exist) {
    if(exist) {
      client.get("code:" + id, function(err, reply) {
        callback(reply);
      });
    } else {
      callback("{}");
    }
  });
}

/*
 * Delete a code snippet
 */
function deleteCode(deleteKey, callback) {
  client.exists("code:delete:" + deleteKey, function(err, exist) {
    if(exist) {
      client.get("code:delete:" + deleteKey, function(err, replyId) {
        var id = replyId.toString();

        client.del("code:" + id, function(err, result) {
          callback(JSON.stringify({deleted: Boolean(result)}));
        });
      });
    } else {
      callback(JSON.stringify({deleted: false}));
    }
  });
}

/*
 * Exporting all to the world
 */
module.exports = {
  createCode: createCode,
  getCode: getCode,
  deleteCode: deleteCode
}
