'use strict';

const assert = require('assert');
const JSOA = require('../src/jsoa');

describe('JavaScript Object Analyzer data tests', () => {
    
    class Person {
        constructor(name) {
            this.name = name;
        }
    }
    
    let data = {
        x: 10,
        y: NaN,
        e: Math.E,
        arr: [ 'p1', 'p2', 'p3' ],
        obj: {
            0: new Set([ false ]),
            1: new Set([ true ])
        },
        sum: (a, b) => a + b,
        fn: {
            inc: function(i) {
                return i + 1;
            },
            Person,
            man: new Person('John')
        },
        date: new Date
    };
    
    it('test flat inspection over a data object', () => {
        assert.deepStrictEqual(JSOA.inspFlat(data), { 
            Number: 3, Array: 1, Object: 2, Function: 1, Date: 1
        });
    });
    
    it('test deep inspection over a data object', () => {
        assert.deepStrictEqual(JSOA.inspDeep(data), { 
            Number: 3, String: 3, Boolean: 2, Function: 3, Person: 1, Date: 1
        });
    });
    
});