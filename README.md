#pull-replay

Replay a pull-stream on demand.

`pull-replay` is a Sink. It will buffer all the data, and will return an object with a `replay` method.

Invoking the `replay()` method will return a Source pull-stream.

## Example

```js
var pull = require("pull-stream");
var replayStream = require("pull-replay");

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
```

## install

With [npm](https://npmjs.org) do:

```
npm install pull-replay
```

## license

MIT