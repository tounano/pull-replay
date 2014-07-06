var pull = require("pull-stream");
var _ = require("underscore");
var parrot = require("pull-parrot");

module.exports = pull.Sink(function (read) {
  var replays = [], memo = [], ended;

  function finishedBuffering() {
    ended = true;
    _.each(replays, function (replay) {
      replay.end();
    });
    replays = [];
  }

  function memorize(end, data) {
    memo.push([end, data]);
    _.each(replays, function (replay) {
      replay.push(_.clone(end), _.clone(data));
    })
  }

  ;(function drain() {
    read(null, function next (end, data) {
      memorize(end, data);
      if (end) return finishedBuffering();
      read(end, next);
    })
  })();

  return {
    replay: function () {
      var replay = parrot();
      _.each(memo, function (pair) {
        replay.push(_.clone(pair[0]), _.clone(pair[1]));
      })

      if (ended) {
        replay.end();
      } else {
        replays.push(replay);
      }

      return replay;
    }
  }
})