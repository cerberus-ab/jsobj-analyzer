;(function() {
    
    // the module exports
    var JSOA = {
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