;(function() {
    
    function inspFlat(obj) {
        // TODO: to implement
    }
    
    function inspDeep(obj) {
        // TODO: to implement
    }
    
    // the module exports
    var JSOA = {
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