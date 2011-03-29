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
 * Get code by range
 */
function getCodesByRange(start, end, callback) {
  client.lrange("code:list", start, end, function(err, reply) {
    if(!reply.length) {
      callback("[]");
    }

    var codesIds = []

    for(var i = 0; i < reply.length; i++) {
      codesIds.push("code:" + reply[i]);
    }

    client.mget(codesIds, function(err, reply) {
      var codes = [];

      for(var i = 0; i < reply.length; i++) {
        codes.push(JSON.parse(reply[i]));
      }

      callback(JSON.stringify(codes));
    });
  });
}

/*
 * Get code by category... range too
 */
function getCodesByCategory(category, start, end, callback) {
  client.lrange("code:list:" + category, start, end, function(err, reply) {
    if(!reply.length) {
      callback("[]");
    }

    var codesIds = []

    for(var i = 0; i < reply.length; i++) {
      codesIds.push("code:" + reply[i]);
    }

    client.mget(codesIds, function(err, reply) {
      var codes = [];

      for(var i = 0; i < reply.length; i++) {
        codes.push(JSON.parse(reply[i]));
      }

      callback(JSON.stringify(codes));
    });
  });
}

/*
 * Creates a code snippet
 */
function createCode(body, callback) {
  client.incr("global:codeId", function(err, reply) {
    var id = reply;

    // Adding the id to the body
    body['id'] = id;

    // Sets the object
    var createdAt = Date.now();

    // Adding date to the body
    body['createdAt'] = createdAt;

    client.set("code:" + id, JSON.stringify(body));

    // Create the delete hash
    var deleteKey = hashlib.sha1(hashSeed + id + createdAt);
    client.set("code:delete:" + deleteKey, id);
    client.expire("code:delete:" + deleteKey, expire);

    // Adding the code to the list of ids of code
    client.lpush("code:list", id);

    // Adding it to category list
    client.lpush("code:list:" + body.type, id);

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
  client.exists("code:delete:" + deleteKey, function(err, reply) {
    var exist = reply;

    if(exist) {
      client.get("code:delete:" + deleteKey, function(err, replyId) {
        var id = replyId.toString();

        // Deleting the code from category
        client.get("code:" + id, function(err, result) {
          var body = JSON.parse(result);

          client.lrem("code:list:" + body.type, 0, id);
        });

        // Deleting all the ids from the list
        client.lrem("code:list", 0, id);

        // Checking for comments
        client.exists("code:" + id + ":comments", function(err, exist) {
          if(exist) {
            // Deleting all the comments
            client.lrange("code:" + id + ":comments", 0, -1, function(err, reply) {
              var comments = [];

              for(var i = 0; i < reply.length; i++) {
                comments.push("comment:" + reply[i]);
              }

              client.del(comments);
            });

            // Delete all the items in list of comments
            client.del("code:" + id + ":comments");
          }
        });

        // Deleting the actual code
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
  deleteCode: deleteCode,
  getCodesByRange: getCodesByRange,
  getCodesByCategory: getCodesByCategory
}
