var pull = require("pull-stream");
var _ = require("underscore");

module.exports = pull.Sink(function (read) {
  var buf = [];
  var doneBuffering = false;

  var replay =  pull.Source(function () {
    var source = null;
    return function (end, cb) {
      if (doneBuffering && _.isArray(source) && source.length == 0)
        return cb(true);
      else if (_.isArray(source) && source.length > 0) {
        var pair = source.shift();
        return cb(pair[0], pair[1]);
      }
      else if (!doneBuffering || !_.isArray(source)) {
        checkWhenBufferingIsDone(end, cb);
      }
    }

    function checkWhenBufferingIsDone(end, cb) {
      if (!doneBuffering)
        return setImmediate( function () {
          return checkWhenBufferingIsDone(end, cb);
        })
      else {
        source = _.clone(buf);
        var pair = source.shift();
        return cb(pair[0], pair[1]);
      }
    }
  })

  read(null, function next (end, data) {
    buf.push([end, data]);
    if(end===true) { doneBuffering = true; return; };
    read(null, next);
  })

  return {
    replay: replay
  };
})