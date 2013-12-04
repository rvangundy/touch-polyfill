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
