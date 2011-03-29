/*
 * utils.js: Things like loggers
 */

/*
 * Log error, basically the same as redis.print but 
 * without the printing of the data ;-)
 */
function logError(err, data) {
  if (err) {
    console.log("Error: " + err);
  }
}

/*
 * Exporting all to the world
 */
module.exports = {
  logError: logError
}
