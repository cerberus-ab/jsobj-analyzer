;(function() {
    
    var constants = {
        // meta
        VERSION: '0.1.4',
        // defaults
        DEFAULT_MAX_DEPTH: 6
    };
    
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
     * @param {number} depth, Current depth of recursion
     * @param {number} maxDepth, Max available depth of recursion
     */
    function iterOver(iterable, reducer, depth, maxDepth) {
        // polyfill for for..of
        var iterator = iterable[Symbol.iterator](), step;
        
        while (!(step = iterator.next()).done) {
            var nextIterable = toIterable(step.value);
            
            if (!nextIterable || (maxDepth > 0 && maxDepth <= (depth + 1))) {
                reducer.add(getTag(step.value));
            } else {
                iterOver(nextIterable, reducer, depth + 1, maxDepth);
            }
        }
    }
    
    /**
     * Collects statistics over a plain or iterable object.
     *
     * @param {object} obj
     * @param {number} maxDepth, By default is not limited
     */
    function inspObject(obj, maxDepth) {
        var iterable = toIterable(obj);
        if (!iterable) {
            throw new TypeError(obj + ' isn`t and can`t be iterable');
        }
        var reducer = initTagsReducer(groupCount);
        iterOver(iterable, reducer, 0, maxDepth || 0);
        return reducer.combine();
    }
    
    // Flat inspection
    function inspFlat(obj) {
        return inspObject(obj, 1);
    }
    
    // Deep inspection
    function inspDeep(obj, maxDepth) {
        return inspObject(obj, typeof maxDepth !== 'undefined' 
            ? parseInt(maxDepth) : constants.DEFAULT_MAX_DEPTH);
    }
    
    // the module exports
    var JSOA = {
        VERSION: constants.VERSION,
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