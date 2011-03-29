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
 * Get all the comments of a code
 */
function getAllComments(codeId, callback) {
  client.exists("code:" + codeId + ":comments", function(err, exist) {
    if(exist) {
      // We found it!
      client.lrange("code:" + codeId + ":comments", 0, -1, function(err, reply) {
        var commentsIds = [];

        // Iterate over all the id's to get them and push them to the array
        for(var i = 0; i < reply.length; i++) {
          commentsIds.push("comment:" + reply[i]);
        }

        // Getting all the comments
        client.mget(commentsIds, function(err, reply) {
          var comments = [];

          for(var i = 0; i < reply.length; i++) {
            comments.push(JSON.parse(reply[i]));
          }

          callback(JSON.stringify(comments));
        });
      });
    } else {
      callback("[]");
    }
  });
}

/*
 * Creates a comment in our code
 */
function createComment(codeId, body, callback) {
  client.incr("global:commentId", function(err, reply) {
    var id = reply;

    // Adding the id to the comment
    body['id'] = id;

    // Sets the object
    var createdAt = Date.now();

    // Adding the date to the body
    body['createdAt'] = createdAt;

    client.set("comment:" + id, JSON.stringify(body));

    // Setting belongsTo so we can delete
    client.set("comment:" + id + ":belongsTo", codeId);

    // Create the delete hash
    var deleteKey = hashlib.sha1(hashSeed + id + createdAt);
    client.set("comment:delete:" + deleteKey, id);
    client.expire("comment:delete:" + deleteKey, expire);

    // Adding the comment to the list of ids of all the comments
    client.lpush("comment:list", id);

    // Adding to the commentId to the list of comments by code
    client.lpush("code:" + codeId + ":comments", id);

    callback(JSON.stringify({id: id, deleteKey: deleteKey}));
  });
}

/*
 * Get a single comment from our database
 */
function getComment(commentId, callback) {
  client.exists("comment:" + commentId, function(err, exist) {
    if(exist) {
      client.get("comment:" + commentId, function(err, reply) {
        callback(reply);
      });
    } else {
      callback("{}");
    }
  });
}

/*
 * Delete a single comment from our database
 */
function deleteComment(deleteKey, callback) {
  client.exists("comment:delete:" + deleteKey, function(err, reply) { 
    var exist = reply;

    if(exist) {
      // Getting the id
      client.get("comment:delete:" + deleteKey, function(err, commentId) {
        // Now we start deleting

        // First from the long list of comments
        client.lrem("comment:list", 0, commentId);

        // From the list of comments by code
        client.get("comment:" + commentId + ":belongsTo", function(err, codeId) {
          client.lrem("code:" + codeId + ":comments", 0, commentId);
        });

        // Delete that key...
        client.del("comment:" + commentId + ":belongsTo");

        // Deleting the comment itself
        client.del("comment:" + commentId, function(err, reply) {
          callback(JSON.stringify({deleted: Boolean(reply)}));
        });
      });

      // We no longer need the delete key
      client.del("comment:delete:" + deleteKey);
    } else {
      callback(JSON.stringify({deleted: false}));
    }
  });
}

/*
 * Exporting all to the world
 */
module.exports = {
  getAllComments: getAllComments,
  createComment: createComment,
  getComment: getComment,
  deleteComment: deleteComment
}
