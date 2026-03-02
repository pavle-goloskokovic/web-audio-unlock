## Web Audio Unlock

### Unlocking Web Audio - the smarter way

In modern browsers, the Web Audio API requires sounds to be triggered from a trusted user gesture before any sound can be played on a webpage.

This method fixes the issue without you even having to think about it, you just pass your `AudioContext` instance to it, and you're good to go!

You can read more about the issue and how this method handles it in [this article](https://medium.com/@pgoloskokovic/unlocking-web-audio-the-smarter-way-8858218c0e09).

Try it out [here](https://pavle-goloskokovic.github.io/web-audio-unlock-example/).

## Installation

```bash
npm install web-audio-unlock --save
```

## Usage

Supports both ESM (`import`) and CommonJS (`require`) consumers.

The default package entry is minified for smaller production bundles.
If you specifically want the unminified build, use:

- ESM: `import webAudioUnlock from 'web-audio-unlock/unminified'`
- CJS: `const webAudioUnlock = require('web-audio-unlock/unminified')`

### JavaScript

```javascript
var webAudioUnlock = require('web-audio-unlock');

var context = new (window.AudioContext || window.webkitAudioContext)();

webAudioUnlock(context)
    .then(function (unlocked)
    {
        if (unlocked)
        {
            // AudioContext was unlocked from a trusted user gesture, sound should start playing now
        }
        else
        {
            // AudioContext was already running, no unlock was needed
        }
    },
    function (reason)
    {
        console.error(reason);
    });

// Do all your sound related stuff here
// as you normally would like if the sound
// was never locked
// ...
var source = context.createBufferSource();
source.buffer = buffer;
source.connect(context.destination);
source.start();
// ...

```

### TypeScript

```typescript
import webAudioUnlock from 'web-audio-unlock';

const context = new (window.AudioContext || window.webkitAudioContext)();

webAudioUnlock(context)
    .then((unlocked: boolean) =>
    {
        if (unlocked)
        {
            // AudioContext was unlocked from a trusted user gesture, sound should start playing now
        }
        else
        {
            // AudioContext was already running, no unlock was needed
        }
    },
    (reason: Error) =>
    {
        console.error(reason);
    });

// Do all your sound related stuff here
// as you normally would like if the sound
// was never locked
// ...
const source = context.createBufferSource();
source.buffer = buffer;
source.connect(context.destination);
source.start();
// ...

```

## License

  The MIT License (MIT), Copyright 2017 [Pavle Goloskokovic](https://github.com/pavle-goloskokovic)
