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
> string getTag(any)

The analyzes needs to determine the type of any variable. This method relies on:
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
class Animal {}; new Animal; | Animal
(x, y) => x + y | Function
function* A(i) { while(1) yield i += 1; } | GeneratorFunction
async function A() { /* await a promise and return */ } | AsyncFunction
