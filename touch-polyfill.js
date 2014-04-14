;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*****************
 *  Constructor  *
 *****************/

/**
 * Constructs a Touch object
 * @param {Number} id       A unique identifier for the Touch object
 * @param {Object} settings Settings related to the Touch object
 */
function Touch(id, settings) {
    if (settings) {
        // Copy over appropriate properties
        for (var i in settings) {
            if (this.hasOwnProperty(i)) {
                this[i] = settings[i];
            }
        }
    }

    this.id = id || 0;
}

/***************
 *  Prototype  *
 ***************/

Touch.prototype = {
    clientX    : 0,
    clientY    : 0,
    identifier : 0,
    pageX      : 0,
    pageY      : 0,
    screenX    : 0,
    screenY    : 0,
    target     : null
};

/*************
 *  Exports  *
 *************/

module.exports = Touch;

},{}],2:[function(require,module,exports){
'use strict';

/**
 * Returns the item at the specified index
 * @param {Number} index The index of the Touch object to return
 * @return {Touch}
 */
function item(index) {
    return this._items[index];
}

/**
 * Feedthrough function to the _items array
 * @return {Array} The spliced array
 */
function splice() {
    return Array.prototype.splice.apply(this._items, arguments);
}

/**
 * Gets the number of Touch objects in the list
 * @return {Number} The length of the list
 */
function getLength() {
    return this._items.length;
}

/*****************
 *  Constructor  *
 *****************/

/**
 * Constructs a TouchList object
 * @param {Array} touches An array of touch objects
 */
function TouchList(touches) {

    Object.defineProperties(this, {
        _items : {
            value        : touches || [],
            writable     : true,
            configurable : false,
            enumerable   : false
        },
        length : {
            get          : getLength,
            configurable : false,
            enumerable   : true
        }
    });
}

/***************
 *  Prototype  *
 ***************/

TouchList.prototype = {
    item   : item,
    splice : splice
};

/*************
 *  Exports  *
 *************/

module.exports = TouchList;

},{}],3:[function(require,module,exports){
'use strict';

/******************
 *  Dependencies  *
 ******************/

var Touch     = require('./Touch');
var TouchList = require('./TouchList');

/***********************
 *  Static Collection  *
 ***********************/

/**
 * A linked-list of all touch objects
 * @type {Object}
 */
var TOUCHES = {};

/**
 * Collections of touches
 * @type {TouchList}
 */
var TOUCH_LIST      = new TouchList();
var CHANGED_TOUCHES = new TouchList();
var TARGET_TOUCHES  = new TouchList();

/********************
 *  Touch Handling  *
 ********************/

/**
 * Creates a touch object based on the passed event
 * @param {Event}  evt        A native event object
 * @param {Number} identifier A unique identifier associated with the touch
 * @return {Touch} touch      A simulated touch object
 */
function createTouch(evt, identifier) {
    var touch;

    identifier = identifier || 0;

    touch = TOUCHES[identifier.toString()] = new Touch(identifier);
    updateTouch(evt, identifier);

    return touch;
}

/**
 * Updates an already existing touch object
 * @param {Event} evt A native event object
 * @param {Number} identifier A unique identifier associated with the touch
 * @return {Touch} touch      A simulated touch object
 */
function updateTouch(evt, identifier) {
    var touch           = TOUCHES[identifier.toString()];
    var documentElement = document.documentElement;

    // If a touch hasn't been created do not proceed
    if (!touch) { return; }

    touch.clientX = evt.clientX;
    touch.clientY = evt.clientY;
    touch.pageX   = evt.pageX || evt.clientX + documentElement.scrollLeft;
    touch.pageY   = evt.pageY || evt.clientX + documentElement.scrollTop;
    touch.screenX = evt.screenX;
    touch.screenY = evt.screenY;
    touch.target  = evt.target;

    // TODO: Expand for multi-touch environments such as IE10
    TOUCH_LIST._items = CHANGED_TOUCHES._items = TARGET_TOUCHES._items = [touch];

    return touch;
}

/**
 * Removes a touch from the collection
 * @param {Number} identifier A unique identifier associated with the touch
 * @return {Touch} touch      A simulated touch object
 */
function removeTouch(identifier) {
    delete TOUCHES[identifier.toString()];
    TARGET_TOUCHES._items = [];
    TOUCH_LIST._items = [];
}

/*********************
 *  Event Overrides  *
 *********************/

/**
 * Captures mouse events and routes them as touch events
 * @param {Event} evt A native event object
 */
function handleMouseDown(evt) {
    evt.stopPropagation();
    createTouch(evt, 0);
    dispatchTouchEvent(evt, 'touchstart');
}

/**
 * Captures a mouse move event and routes as a touch event
 * @param {Eent} evt A native event object
 */
function handleMouseMove(evt) {
    var touch;

    evt.stopPropagation();
    touch = updateTouch(evt, 0);
    if (touch) { dispatchTouchEvent(evt, 'touchmove'); }
}

/**
 * Captures a ouse move event and routes it as a touch event
 * @param {Event} evt A native event object
 */
function handleMouseUp(evt) {
    var touch;

    evt.stopPropagation();
    touch = updateTouch(evt, 0);
    removeTouch(0);
    if (touch) { dispatchTouchEvent(evt, 'touchend'); }
}

/**
 * Registers event overrides that route native events to simulated touch events
 */
function registerEventOverrides() {
    var addEventListener;

    // Only use if touch events are not supported
    try { document.createEvent('TouchEvent'); }
    catch(e) {
        addEventListener = document.body.addEventListener.bind(document.body);

        // Register for mouse events
        addEventListener('mousedown', handleMouseDown, true);
        addEventListener('mouseup',   handleMouseUp,   true);
        addEventListener('mousemove', handleMouseMove, true);
    }

    // Register for IEPointer events
    // if (window.navigator.msPointerEnabled) {
    //     addEventListener('MSPointerDown', handlePointerDown, false);
    //     addEventListener('MSPointerUp',   handlePointerUp,   false);
    //     addEventListener('MSPointerMove', handlePointerMove, false);
    // }
}

/********************
 *  Event Dispatch  *
 ********************/

/**
 * Dispatches a touch event based on a non-touch event (mouse, MSPointer)
 * @param {Event} e A native event object
 */
function dispatchTouchEvent(e, type) {
    /*
     * Supports:
     *   - addEventListener
     *   - setAttribute
     */
    var event = createTouchEvent(e, type);
    e.target.dispatchEvent(event);

    /*
     * Supports:
     *   - element.ontouchstart
     */
    var fn = e.target['on' + type];
    if (typeof fn === 'function') { fn(e); }
}

/**
 * Utility function to create a touch event.
 * @param {Event} e The event to convert to a TouchEvent
 * @param  name  {String} of the event
 */
var createTouchEvent = function(e, name) {
    var event = document.createEvent('MouseEvents');

    event.initMouseEvent(
        name,
        e.bubbles,
        e.cancelable,
        e.view,
        e.detail,
        e.screenX,
        e.screenY,
        e.clientX,
        e.clientY,
        e.ctrlKey,
        e.altKey,
        e.shiftKey,
        e.metaKey,
        e.button,
        e.relatedTarget
    );

    event.changedTouches = CHANGED_TOUCHES;
    event.touches        = TOUCH_LIST;
    event.targetTouches  = TARGET_TOUCHES;

    return event;
};

/********************
 *  Initialization  *
 ********************/

/**
 * Initializes on document-load and dynamic-loading.
 */
if (document.readyState === 'complete' || document.readyState === 'loaded') {
    registerEventOverrides();
}
else {
    window.addEventListener('load', registerEventOverrides, false);
}

},{"./Touch":1,"./TouchList":2}]},{},[3])
;