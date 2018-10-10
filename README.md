# JavaScript Object Analyzer ![Build Status](https://travis-ci.org/cerberus-ab/jsobj-analyzer.svg?branch=master)
Provides information about structure of a JavaScript object.

## Installation
Using npm:
```bash
$ npm i --save jsobj-analyzer
```

In a browser:
```html
<script src="dist/jsoa.min.js"></script>
```

In node.js:
```javascript
var JSOA = require('jsobj-analyzer');
```

Also the module exported as AMD module.

## Documentation
* [Get Tag](#get-tag)
* [Flat Inspection](#flat-inspection)
* [Deep Inspection](#deep-inspection)

### Get Tag
> string getTag(Mixed any)

The analyzes needs to determine the type of any variable. This function relies on:
1. used or overridden well-known [Symbol toStringTag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) for objects;
2. read-only property [Function.name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) taken from constructor if the variable has been instantiated;
3. finally result of [Object.prototype.toString](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-object.prototype.tostring) which can process any variable at all.

Actually built-in method *Object.prototype.toString* may do all work, but getting type for any user-typed variables is more conveniently by using *constructor.name* by default if it's possible.

Some examples:

Definition of A | getTag(A) 
--- | ---
10 | Number
Math.PI | Number
NaN | Number
-0 | Number
undefined | Undefined
null | Null
true | Boolean
'Hello' | String
{ x: 1, y: 0 } | Object
[1, 2, 3] | Array
new Set | Set
Set | Function
JSON | JSON
class Animal {} new Animal | Animal
(x, y) => x + y | Function
function* A(i) { while(1) yield i += 1; } | GeneratorFunction
async function A() { /* await a promise and return */ } | AsyncFunction

### Flat Inspection
> object inspFlat(object obj)

The function collects statistics about an object structure. Requires plain or iterable object as first parameter.

For example let's describe next object:

```javascript
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

console.log(JSOA.inspFlat(data));
```

The output will be:
```
{ Number: 3, Array: 1, Object: 2, Function: 1, Date: 1 }
```

### Deep Inspection
> object inspDeep(object obj, number maxDepth = 6)

Unlike the previous function collects statistics recursively over all nested plain and iterable objects too. 

The same data with deep inspection:
```javascript
console.log(JSOA.inspDeep(data));
```

The output will be:
```
{ Number: 3, String: 3, Boolean: 2, Function: 3, Person: 1, Date: 1 }
```

The optional second parameter *maxDepth* limits the depth of inspection. By default is 6: it's enough for most cases.

## Changelog
### 0.1.4
* Supported parameter *maxDepth* for deep inspection (Closed [Issue #2](https://github.com/cerberus-ab/jsobj-analyzer/issues/2))
