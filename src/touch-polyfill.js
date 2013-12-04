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
