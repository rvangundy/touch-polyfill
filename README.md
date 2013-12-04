# touch-polyfill

A polyfill for the touch event model. Allows for standardizing user input using touch events as opposed to mouse events or pointer events* (IE10+)

*not yet supported

# Installation

```
npm install rvangundy/touch-polyfill --save
```

# Usage

The touch polyfill is intended to be used with [browserify](https://github.com/substack/node-browserify).

Include the touch-polyfill at the beginning of your application code.

```javascript
require('touch-polyfill');
```

It is then possible to register for touch events using standard event registration:

```javascript
document.body.addEventListener('touchstart', function() { alert('touched!'); });
```
