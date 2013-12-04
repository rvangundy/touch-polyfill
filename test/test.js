'use strict';

require('../src/touch-polyfill');
var assert = chai.assert;
var params = [
    null,         // type
    true,         // bubbles
    true,         // cancelable
    window,       // view
    1,            // detail
    0,            // screenX
    0,            // screenY
    0,            // clientX
    0,            // clientY
    false,        // ctrlKey
    false,        // altKey
    false,        // shiftKey
    false,        // metaKey
    0,            // button
    document.body // relatedTarget
];

describe('Touch Events', function () {
    it('It triggers touchstart on mousedown event', function(ok) {
        var event = document.createEvent('MouseEvents');

        document.body.addEventListener('touchstart', function(evt) {
            assert.equal(evt.touches.length, 1);
            assert.equal(evt.changedTouches.length, 1);
            assert.equal(evt.targetTouches.length, 1);
            ok();
        });

        params[0] = 'mousedown';
        event.initMouseEvent.apply(event, params);

        document.body.dispatchEvent(event);
    });

    it('It triggers touchmove on mousemove event', function(ok) {
        var event = document.createEvent('MouseEvents');

        document.body.addEventListener('touchmove', function(evt) {
            assert.equal(evt.touches.length, 1);
            assert.equal(evt.changedTouches.length, 1);
            assert.equal(evt.targetTouches.length, 1);
            ok();
        });

        params[0] = 'mousemove';
        event.initMouseEvent.apply(event, params);

        document.body.dispatchEvent(event);
    });

    it('It triggers touchend on mouseup event', function(ok) {
        var event = document.createEvent('MouseEvents');

        document.body.addEventListener('touchend', function(evt) {
            assert.equal(evt.touches.length, 0);
            assert.equal(evt.changedTouches.length, 1);
            assert.equal(evt.targetTouches.length, 0);
            ok();
        });

        params[0] = 'mouseup';
        event.initMouseEvent.apply(event, params);

        document.body.dispatchEvent(event);
    });
});
