'use strict';

const assert = require('assert');
const JSOA = require('../src/jsoa');

describe('JavaScript Object Analyzer specification', () => {
   
    describe('the module', () => {
        it('should provide a function for flat inspection: inspFlat', () => {
            assert.ok(typeof JSOA.inspFlat == 'function');
        });
        it('should provide a function for deep inspection: inspDeep', () => {
            assert.ok(typeof JSOA.inspDeep == 'function');
        });
    });
    
});