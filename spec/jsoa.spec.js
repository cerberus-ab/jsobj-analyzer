'use strict';

const assert = require('assert');
const JSOA = require('../src/jsoa');

describe('JavaScript Object Analyzer specification', () => {
   
    describe('the module', () => {
        it('should contain number of current version', () => {
            assert.ok(typeof JSOA.VERSION == 'string'); 
        });
        it('should provide a function for getting tag: getTag', () => {
            assert.ok(typeof JSOA.getTag == 'function');
        });
        it('should provide a function for flat inspection: inspFlat', () => {
            assert.ok(typeof JSOA.inspFlat == 'function');
        });
        it('should provide a function for deep inspection: inspDeep', () => {
            assert.ok(typeof JSOA.inspDeep == 'function');
        });
    });
    
    describe('getTag: Get the tag of a variable', () => {
        it('should pay attention on Symbol.toStringTag firstly', () => {
            let kitten = {
                [Symbol.toStringTag]: 'Kitten'
            };
            class Cat {
                get [Symbol.toStringTag]() {
                    return 'Kitten';
                }
            }
            assert.strictEqual(JSOA.getTag(kitten), 'Kitten');
            assert.strictEqual(JSOA.getTag(new Cat), 'Kitten');
        });
        it('should pay attention on constructor.name for objects secondly', () => {
            function Dog() {}
            class Cat {}
            assert.strictEqual(JSOA.getTag(new Dog), 'Dog');
            assert.strictEqual(JSOA.getTag(new Cat), 'Cat');
        }); 
        it('should consider separately: null, undefined, NaN', () => {
            assert.strictEqual(JSOA.getTag(null), 'Null');
            assert.strictEqual(JSOA.getTag(undefined), 'Undefined');
            assert.strictEqual(JSOA.getTag(NaN), 'Number');
        });
    });
    
    describe('inspFlat: Flat inspection cases', () => {
        it('should require a plain or iterable object', () => {
            assert.throws(() => JSOA.inspFlat('seed'), TypeError);
            assert.throws(() => JSOA.inspFlat(null), TypeError);
        });
        it('should collect stats over a plain object properties', () => {
            assert.deepStrictEqual(JSOA.inspFlat({ x: 10, y: 20, exists: true, name: 'p1' }), { 
                Number: 2, Boolean: 1, String: 1
            });
        });
        it('should collect stats over Array', () => {
            assert.deepStrictEqual(JSOA.inspFlat([ Infinity, x => 0, new Date ]), {
                Number: 1, Function: 1, Date: 1 
            });
        });
        it('should collect stats over Set/Map', () => {
            assert.deepStrictEqual(JSOA.inspFlat(new Map([['a', 1], ['b', 2], ['c', 3]])), {
                Array: 3 
            });
            assert.deepStrictEqual(JSOA.inspFlat(new Set([1, 1, 2, 2, 3])), {
                Number: 3 
            });
        });
        it('should collect stats over any iterable objects', () => {
            let iterable = {
                [Symbol.iterator]() {
                    return {
                        i: 0,
                        next() {
                            if (this.i < 10) {
                                return { value: this.i++, done: false };
                            }
                            return { value: undefined, done: true };
                        }
                    };
                }
            };
            assert.deepStrictEqual(JSOA.inspFlat(iterable), {
                Number: 10
            });
        });
        it('should consider nested plain and iterable objects flatly', () => {
            assert.deepStrictEqual(JSOA.inspFlat({ obj: { x: 10 }, arr: [1, 2, 3] }), {
                Object: 1, Array: 1
            });
        });
    });
    
    describe('inspDeep: Deep inspection cases', () => {
        it('should collect stats recursively over plain and iterable objects', () => {
            assert.deepStrictEqual(JSOA.inspDeep({ obj: { x: 10 }, arr: [1, 2, [3, 4]] }), {
                Number: 5
            });
        });
        it('should respect max depth passed as second parameter', () => {
            assert.deepStrictEqual(JSOA.inspDeep({ 1: { 2: { 3: true } } }, 2), { 
                Object: 1
            });
        });
        it('should respect max depth by default: 6', () => {
            assert.deepStrictEqual(JSOA.inspDeep({ 1: { 2: { 3: { 4: { 5: { 6: { 7: true } } } } } } }), { 
                Object: 1
            });
            assert.deepStrictEqual(JSOA.inspDeep({ 1: { 2: { 3: { 4: { 5: { 6: true } } } } } }), { 
                Boolean: 1
            });
        });
    });
    
});