background-image: url(/images/js-logo.png)

# ECMAScript 6 - Harmony

### 18 Years of Specifications
---

# ECMAScript 1 through 5

- Precursor
  * Brendan - Mocha
  * Netscape codenames LiveScript
  * Netscape announces JavaScript (1995)
  * Netscape releases JavaScript (1996)
- 1 ECMA establishes specification (1997)
- 2 ISO/IEC 16262 I18N (1998)
- 3 RegExp, String formatting, try/catch, errors (1999)
- 4 failure, arguing, punted and renamed Harmony (1999-2009)
- 5 ‘use strict’, JSON, get, set, reflection (2009)
- 5.1 international standardization (2011)

![ECMA](http://www.ecma-international.org/images/logo_printerf.jpg)
---

![Standards](http://i.imgur.com/eZGm64W.png)
---

# Transpiling

- Firefox, Chrome hot on tail
- GWT/Type/Clojure/Dart/Coffee/JSX history
- Compiling to ES5
- ES6 via Babel (71%) or Traceur (58%)
- Mana began development with ES6 via Babel
- ES6 gets standardized (June 2015)

![Compiling](http://imgs.xkcd.com/xk3d/303/compiling_4.png)
---

## Constants

- Immutable Variables

```javascript
const E = 2.71828;
const PI = 3.14;
E < PI; // true
E = PI; // Line 4: "E" is read-only
```
---

## Scoping

- Block-Scoped Variables

```javascript
let a = [1];
for (let i = 0; i < a.length; i++) {
  let x = a[i] + 1;
}
console.log(i, x, a); // i is not defined, x is not defined, [1]
```

- Block-Scoped Functions

```javascript
{
  function foo () { return 'hello'; }
  foo(); // hello
  {
    function foo () { return 'world'; }
    foo(); // world
  }
  foo(); // hello
}
```
---

## Arrow Functions

- Expression Bodies

```javascript
let admins = collection.map( m => m.get("admin") );
console.log(m); // m is not defined
```
- Statement Bodies
- Lexical _this_

```javascript
this.accepted = [];
this.collection.each((m) => {
  if (m.get("state") === "accepted")
    this.accepted.push(m);
});
```
---

## Extended Parameter

- Defaults
- Rest Parameter
- Spread Operator

```javascript
{
  initialize: function(options = {}) {
    _(this.defaults).extend(options);
  },
  generateName: function(conversation, names...) {
    console.log(names); // ["Angie", "Ariel", "Jared"]
    conversation.set("name", names.join(", "));
  }
}

var params = [ "kana", [true], 7 ]
[ 1, 2, ...params ].length // 5
```
---

## Template Strings

- String Interpolation
- Multiline support
- Raw String Access

```javascript
var lastSeenAt = `Last Seen ${manawa(@model.get("sent_at"))}`;

console.log(`Aloha
Hawaii`);

String.raw `Dear, \n World ${ 42 }` === "Dear, \\n World 42";
```
---

## Extended Literals

- Binary and Octal
- Unicode String/RegExp

```javascript
0b110010100 === 404;

"\u{0CA0}_\u{0CA0}" === "ಠ_ಠ"
```
---

## Enhanced Regular Expression

- Sticky Matching
- Efficient Parsing

```javascript
var example = 'code';
```
---

## Enhanced Object Properties
- Property Shorthand
- Computer Property Names
- Method Properties

```javascript
var options = { animate, duration }; // shorthand

var properties = {
  color: "blue",
  [ "avatar_" + getSize() ]: 42
};

var helpers = {
    foo (a, b) {
      // …
    },
    *quux (x, y) {
      //  …
    }
};
```
---

## Destructuring Assignment

- Array Matching
- Object Matching (Deep)
- Parameter Matching
- Fail-Soft with Defaults

```javascript
var list = [ "Blue", "Red", "Yellow" ];
var [ first, , second ] = list;
[ second, first ] = [ first, second ];

var { members, meta: { total_count, updated_at } } = payload();

function sum ([ x, y ]) { return x + y; }
function latestMessageText ({ senderName, body }) {
  return `${senderName}: ${body}`;
}

var [ a = 1, b = 2, c = 3, d ] = [ 4, 5 ];
```
---

## Modules

- Export
- Import
- Default
- Wildcard

```javascript
export function randomNumber {
  return Math.floor( Math.random() * 11 );
}

import { Input, Label } from "react-bootstrap";

export default (x) => x * x;

import * as _ from "underscore";
```
---

## Classes

- Declaration / Inheritance
- Expressions
- Base Class Access
- Static Members
- Getters / Setters

```javascript
class Group extends Party {
  constructor (name, color) {
    super(name);
    this.color = color;
  }
  static defaultGroup () {
    return new Group("Engineering", "#232b38");
  }
  set name  (name) { this._name = name; }
  get name  ()     { return this._name; }
  get color ()     { return this._color; }
}
var engineering = Group.defaultGroup();
engineering.color === "#232b38"
```
---

## Symbol Type

- Unique
- Immutable
- Optional Descriptions (debug)
- Global Symbols

```javascript
let attributes = {};
const avatar = Symbol();
attributes[avatar] = new Avatar();
typeof avatar // "symbol"
Object.getOwnPropertySymbols(attributes); // [ avatar ]

Symbol("avatar") === Symbol("avatar") // false
Symbol.for("avatar") === Symbol.for("avatar"); // true
```
---

## Iterators

- Iterable Protocol
- For _ of _

```javascript
var example = 'code';
```
---

## Generators

- Iterator Protocol
- Direct
- Matching
- Control-Flow

```javascript
var example = 'code';
```
---

## Data Structures

- Maps
- Sets
- Weak-linked Maps and Sets

```javascript
var example = 'code';
```
---

## Typed Arrays

- Arbitrary byte-based data structures
- Network Protocols
- Cryptography Algorithms
- File Format Manipulations

```javascript
let buffer = new ArrayBuffer(24);
let amountDue = new Float32Array(buffer, 20,  1);

let imageData = new Uint8ClampedArray([42, 1337]);
console.log(imageData[1]); // 255

```
---

## Additional Built-in Methods

- Object Property Assignment
- Array Element Finding
- String Repeating and Searching
- Number Type and Safety Checking
- Number Comparison / Truncation / Sign Determination

```javascript
Object.assign({a: 1}, {b: 2}, {c: 3}); // { a: 1, b: 2, c: 3 }
[ 1, 3, 4, 2 ].find(x => x > 3); // 4
"aloha".repeat(3); // alohaalohaaloha
"/networks/lua/latest".includes("networks") // true, also endsWith and startsWith
Number.isNaN(NaN) || Number.isFinite(Infinity) || Number.isSafeInteger(10007199254740992) // true || false || false
Number.EPSILON // instead of 2.22e-16
Math.trunc(-42.7) // -42
Math.sign(-7) // -1
```
---

## Promises

- Async Callback
- Chaining

```javascript


Promise.all(networkPromises).then((data) => {
  NetworkActions.setNetworks(data);
}, (err) => {
  errorHandler(err);
});
```
---

## Meta Programming

- Proxying
- Reflection

```javascript

let obj = { a: 1 }
Object.defineProperty(obj, "b", { value: 2 })
obj[Symbol("c")] = 3
Reflect.ownKeys(obj) // [ "a", "b", Symbol(c) ]
```
---

# What is next?

- ES7
  * Object.observe
  * Async (Event Loop Concurrency)
  * Comprehensions
  * Guards (user defined invariants!)
- ES8
  * a long ways out
  * Macros (make your own syntax)
  * Parallel arrays

![XKCD](http://i.imgur.com/PsVj5Nl.png)
---

# Finito

- Compatibility Table:
http://kangax.github.io/compat-table/es6/

- Future of JS:
http://www.2ality.com/2011/09/es6-8.html

- REPL:
https://babeljs.io/repl/#?experimental=true

- Feature List
http://es6-features.org
---

<iframe src="https://babeljs.io/repl/#?experimental=true" style="height:100%;width:100%;" />