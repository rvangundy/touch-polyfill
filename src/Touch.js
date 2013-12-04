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
