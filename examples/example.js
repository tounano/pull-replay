var pull = require("pull-stream");
var replayStream = require("../replay");

var recorder = pull(
  pull.values([1,2,3,4]),
  replayStream()
);


pull(
  recorder.replay(),
  pull.drain(console.log)
)

pull(
  recorder.replay(),
  pull.drain(console.log)
)