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
---

# Transpiling

- GWT/Type/Clojure/Dart/Coffee/JSX history
- Compiling to ES5
- ES6 via Babel (71%) or Traceur (58%)
- Mana began development with ES6 via Babel
- Firefox, Chrome hot on tail
- ES6 gets standardized (June 2015)
---

# Constants

- Immutable Variables

```javascript
const E = 2.71828;
const PI = 3.14;
E < PI; // true
E = PI; // Line 4: "E" is read-only
```
---

# Scoping

- Block-Scoped Variables
- Block-Scoped Functions

#### Variables
```javascript
let a = [1];
for (let i = 0; i < a.length; i++) {
  let x = a[i] + 1;
  console.log(x); // 2
}
console.log(i); // i is not defined
console.log(x); // x is not defined
console.log(a); // [1]
```
---

# Scoping Continued

#### Functions

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


# Arrow Functions

- Expression Bodies
- Statement Bodies
- Lexical _this_

```javascript
var example = 'code';
```
---

# Extended Parameter

- Defaults
- Rest Parameter
- Spread Operator

```javascript
var example = 'code';
```
---

# Template Strings

- String Interpolation
- Custom Interpolation
- Raw String Access

```javascript
var example = 'code';
```
---

# Extended Literals

- Binary and Octal
- Unicode String
- RegExp

```javascript
var example = 'code';
```
---

# Enhanced Regular Expression

- Sticky Matching
- Efficient Parsing

```javascript
var example = 'code';
```
---

# Enhanced Object Properties
- Property Shorthand
- Computer Property Names
- Method Properties

```javascript
var example = 'code';
```
---

# Destructuring Assignment

- Array Matching
- Object Matching (Deep)
- Parameter Matching
- Fail-Soft with Defaults

```javascript
var example = 'code';
```
---

# Modules

- Export
- Import
- Default
- Wildcard

```javascript
var example = 'code';
```
---

# Classes

- Declaration / Inheritance
- Expressions
- Base Class Access
- Static Members
- Getters / Setters

```javascript
var example = 'code';
```
---

# Symbol Type

- Unique
- Immutable
- Optional Descriptions (debug)
- Global Symbols

```javascript
var example = 'code';
```
---

# Iterators

- Iterable Protocol
- For _ of _

```javascript
var example = 'code';
```
---

# Generators

- Iterator Protocol
- Direct
- Matching
- Control-Flow

```javascript
var example = 'code';
```
---

# Data Structures

- Maps
- Sets
- Weak-linked Maps and Sets

```javascript
var example = 'code';
```
---

# Typed Arrays

- Arbitrary byte-based data structures
- Network Protocols
- Cryptography Algorithms
- File Format Manipulations

```javascript
var example = 'code';
```
---

# Additional Built-in Methods

- Object Property Assignment
- Array Element Finding
- String Repeating and Searching
- Number Type and Safety Checking
- Number Comparison / Truncation / Sign Determination

```javascript
var example = 'code';
```
---

# Promises

- Async Callback
- Chaining

```javascript
var example = 'code';
```
---

# Meta Programming

- Proxying
- Reflection

```javascript
var example = 'code';
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