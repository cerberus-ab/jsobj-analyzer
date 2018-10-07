;(function() {
    
    var VERSION = '0.1.1';
    
    /**
     * Get Tag via Symbol.toStringTag, Function.name 
     * or default toString method of Object.
     * 
     * @param {Mixed} any
     * @returns {string}
     */
    function getTag(any) {
        if (isObject(any)) {
            if (typeof any[Symbol.toStringTag] === 'string') {
                return any[Symbol.toStringTag];
            }
            if (typeof any.constructor === 'function' && typeof any.constructor.name === 'string') {
                return any.constructor.name;
            }
        }
        return Object.prototype.toString.call(any).match(/\[object\s(\w+)]/)[1];
    }
    
    /**
     * Predicates for checking a variable for:
     * object, plain object and iterable object.
     * 
     */
    function isObject(any) {
        return typeof any === 'object' && any !== null;
    }
    function isPlainObject(any) {
        return isObject(any) && any.constructor === Object;
    }
    function isIterable(any) {
        return isObject(any) && typeof any[Symbol.iterator] === 'function';
    }
    
    /**
     * Returns iterable seed of a variable if it`s possible.
     * 
     * @param {Mixed} any
     * @returns {object|undefined}
     */
    function toIterable(any) {
        if (isIterable(any)) {
            return any;
        }
        if (isPlainObject(any)) {
            // polyfill for Object.values
            return Object.keys(any).map(function(k) { 
                return any[k];
            });
        }
    }
    
    /**
     * Group and count elements in array.
     * 
     * @param {Array<string>} array
     * @returns {object}
     */
    function groupCount(array) {
        return array.reduce(function(res, el) {
            res[el] = (res[el] || 0) + 1;
            return res;
        }, {});
    }
    
    /**
     * Creates reducer for collecting and resulting tags collection;
     * provides add and combine methods respectively.
     *
     * @param {function} combiner
     * @returns {object}
     */
    function initTagsReducer(combiner) {
        var tags = [];
        return {
            add: function(tag) {
                tags.push(tag);
            },
            combine: function() {
                return combiner(tags);
            }
        };
    }
    
    /**
     * Recursively iterates over an iterable object 
     * using reducer for accumulating the data.
     *
     * @param {object} iterable
     * @param {object} reducer, Should be created by initTagsReducer
     * @param {boolean} deep, Set true for deep iterating
     */
    function iterOver(iterable, reducer, deep) {
        // polyfill for for..of
        var iterator = iterable[Symbol.iterator](), step;
        
        while (!(step = iterator.next()).done) {
            var value = step.value;
            var nextIterable = toIterable(value);
            
            if (!(deep && nextIterable)) {
                reducer.add(getTag(value));
            } else {
                iterOver(nextIterable, reducer, deep);
            }
        }
    }
    
    /**
     * Collects statistics over a plain or iterable object.
     *
     * @param {object} obj
     * @param {boolean} deep, Set true for collecting data in nested objects
     */
    function inspObject(obj, deep) {
        var iterable = toIterable(obj);
        if (!iterable) {
            throw new TypeError(obj + ' isn`t and can`t be iterable');
        }
        var reducer = initTagsReducer(groupCount);
        iterOver(iterable, reducer, Boolean(deep));
        return reducer.combine();
    }
    
    // Flat inspection
    function inspFlat(obj) {
        return inspObject(obj);
    }
    
    // Deep inspection
    function inspDeep(obj) {
        return inspObject(obj, true);
    }
    
    // the module exports
    var JSOA = {
        VERSION: VERSION,
        getTag: getTag,
        inspFlat: inspFlat,
        inspDeep: inspDeep    
    };

    // define the module as AMD, commonJS or global
    if (typeof define == 'function' && define.amd) {
        define([], function() {
            return JSOA;
        });
    } else if (typeof exports != 'undefined') {
        exports = module.exports = JSOA;
    } else {
        this.JSOA = JSOA;
    }

}.call(this));