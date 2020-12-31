# Documentation

# Types

There are 6 primitive types in Bang:

- String
- Number
- Boolean
- Null
- Function
- Dictionary
- List

## Strings

Represents text/ a collection of characters.
Strings are immutable.

```
'a simple string'
"another string"
`an extra string`

`can
also
be multiline`
```

### Operators

**equality (==, !=) and comparisons (>, <, >=, <=)**

Compares the values of the strings, compares based on character values of strings. Equality check types.

```
`tree` == `tree`
"tree" != 'forest'
"forest" == 'forest'
"b" > "a"
"A" < "a"
"c" < "d"
"af" < "df"
"job" > "Rest"
"fred" >= "fred"
"hidden" <="words"
```

**plus (+)**

Concatenates 2 strings, left-associative

```
"hello" + ` ` + 'world' // 'hello world'
```

### Index Access + Slicing

You can access characters based on their index, or get a substring by using slice notation.

```
'hello'[0] // 'h'
'hello'[1] // 'e'
'hello'[4] // 'o'
'hello'[5] // Error
'a longer string'[2:7] // 'longer'
'a longer string'[:2] // 'a '
'a longer string'[8:] // 'string'
```

### Built-in Methods + Properties

**length**

- A number representing the length of the string

**toUppercase()**

- Converts the string to uppercase characters
- Takes 0 parameters
- Returns a new string, with all the characters in uppercase

**toLowercase()**

- Converts the string to lowercase characters
- Takes 0 parameters
- Returns a new string, with all the characters in lowercase

**reverse()**

- Reverses a string
- Takes 0 parameters
- Returns a new string, in the reverse order

**replaceOne(replacementTarget, replacementString)**

- Replace a value in a string
- Takes 2 strings as parameters, the replacementTarget is the substring to be replaced and the replacementString is the string to replace it with
- Only the first replacementTarget is replaced
- Returns a new string with the replacementTarget replaced with the replacementString

**replace()**

- Replace all value matching a pattern in a string
- Takes 2 strings as parameters, the replacementTarget is the substring to be replaced and the replacementString is the string to replace it with
- All occurrences of replacementTarget is replaced
- Returns a new string with the replacementTarget replaced with the replacementString

**split(specifier)**

- Splits a string at a specifier
- Takes 1 string as a parameter
- Returns a list of strings

**trim()**

- Remove the whitespace from the start and the end of the string
- Takes 0 parameters
- Returns a new string with the whitespace at the start and end removed

**trimStart()**

- Remove the whitespace from the start of the string
- Takes 0 parameters
- Returns a new string with the whitespace at the start removed

**trimEnd()**

- Remove the whitespace from the end of the string
- Takes 0 parameters
- Returns a new string with the whitespace at the end removed

**includes(value)**

- Check if a value is in a string
- Takes one parameter which is the value to check if it is in the string
- Return a boolean of if the value is in the string or not

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- If the value has a length is not zero it returns `true`, else if the length is zero it returns `false`

**toNumber()**

- Converts the value to a number
- Takes 0 parameters
- Returns a number of the value converted to a number, throws an error if it cannot be converted

**toString()**

- Converts the value to a string
- Takes 0 parameters
- Returns the current value

## Number

Represents an integer or floating-point number.
Numbers are immutable.

```
123
7
23.45
123.69
.3489
.1

// _ can be used as numeric separators
123_456_789
23_456.12
23_456.123_456
```

### Operators

**equality (==, !=) and comparisons (>, <, >=, <=)**

Compares the values of the numbers, equality check types.

```
1 == 1       // true
1 == 1.0     // true
3.45 == 3.45 // true
23 != 45     // true
1 > 4        // false
1 < 4        // true
4 < 1        // false
4 > 1        // true
1 > 1        // false
1 >= 1       // true
1 < 1        // false
1 <= 1       // true
```

**power/ indices (\*\*)**

Raises the first number to the power of the second, left-associative

```
3 ** 4 // 81
16 ** 0.5 // 4
```

**multiply (\*)**

Multiplies 2 numbers, left-associative

```
3 * 4 // 12
123 * 55 // 6765
```

**divide (/)**

Divides 2 numbers, left-associative

```
3 / 4 // 0.75
55 / 11 // 5
```

**plus (+)**

Adds 2 numbers, left-associative

```
3 + 4 // 7
123 + 55 // 178
```

**minus (-)**

Subtract 2 numbers, left-associative

```
3 - 4 // -1
123 - 55 // 68
```

**unary minus (-)**

Negate a number, right-associative

```
-4 // -4
-(-8) // 8
```

### Built-in Methods + Properties

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- Returns `true` if the number is not `0`

**toNumber()**

- Converts the value to a number
- Takes 0 parameters
- Returns the current value

**toString()**

- Converts the value to a string
- Takes 0 parameters
- Returns the value as a string if the conversion fails it throws an error

## Boolean

Represents a value which can be one of 2 states, `true` and `false`.
Booleans are immutable.

```
true
false
```

### Operators

**equality (==, !=)**

Compares the values of the booleans, equality check types.

```
true == true
true != false
false != true
false == false
true != 'true'
true != 1
false != null
```

**not (!)**

Negates the boolean value

```
!true  // false
!false // true
```

### Built-in Methods + Properties

**toBoolean()**

- Takes 0 parameters
- Returns the same value

**toNumber()**

- Converts the value to a number
- Takes 0 parameters
- Returns `1` if value is `true` and `0` if the value is `false`

**toString()**

- Converts the value to a string
- Takes 0 parameters
- Returns the `'true'` if value is `true` else if value is `false` it returns `'false'`

## Null

Representing a missing, undefined value.
Null is immutable.

```
null
```

### Operators

**equality (==, !=)**

Compares the value to null, equality check types.

```
null == null
null != 'null'
null != 0
```

### Built-in Methods + Properties

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- Returns `false`

**toNumber()**

- Converts the value to a number
- Takes 0 parameters
- Returns `0`

**toString()**

- Converts the value to a string
- Takes 0 parameters
- Returns `'null'`

## Function

Takes parameters and returns a result. If no return value is defined it returns null. There is a maximum of 255 parameters for a function. Functions are Immutable.

```
// define a function, with comma separated identifiers as parameter names
// (parameters) => <statement>

// no parameters
() => <do stuff>

// multiple parameters, return the expression
(a, b, c, d) => <do stuff>

// multiple parameters in a block
(a, b, c, d) =>
  <do stuff>
  <do more stuff>
  <result of stuff>

// multiple parameters in a block and return a value
(a, b, c, d) =>
  <do stuff>
  <do more stuff>
  return <result of stuff>

// The following functions are equivalent
(
  a,
  b,
  c
) =>
  return a + b + c

(a, b, c) => a + b + c

// call a function, with expressions for arguments comma separated
// functionIdentifier(expressions)

aFunction()
anotherFunction(1, 2, 3)
reallyExciting(false, "hello" + 'world', 77 / 11)
```

### Operators

**equality (==, !=)**

Compares the values of the functions, only equal if they point to the same instance of a function

```
let a = () => 1
a == a

(() => 1) != (() => 1)
```

### Built-in Methods + Properties

**toString()**

- Returns a string representation of the function
- Takes 0 parameters
- Returns `"<function (name if given)>"`
- The name is taken from the variable it is assigned to (if assigned to a variable)

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- Returns `true`

## Dictionary

A map from strings to other values, similar to dictionaries in Python or HashMaps in Java.
Strings/ identifier can be used as the identifying keys in dictionaries.
If a variable is used as a key and a value is not specified, the identifier will be used as the key and the variable value will be used as a value.
It is mutable by default.

```
// defining dictionaries
{a: 'something', b: 77, c: 22,}
{
  a: 'something',
  b: 77,
  c: 22,
}
{
  'a': 'something'
  'b': 77
  'c': 22
}
{ numberOfPeople: 7, isActive: false, price: 22.12 }

// get a value in a dictionary
{a: 'something', b: 77, c: 22}.a    // 'something'
{a: 'something', b: 77, c: 22}['a'] // 'something'
{
  numberOfPeople: 7,
  isActive: false,
  price: 22.12
}.numberOfPeople // 7
{
  numberOfPeople: 7,
  isActive: false,
  price: 22.12
}['is'+'Active'] // false

// if dictionary is immutable you can set values
let a = {
  numberOfPeople: 7,
  isActive: false,
  price: 22.12
}
a.numberOfPeople // 7
a.numberOfPeople += 1
a.numberOfPeople // 8

// expand variables
let apple = 7
let bannanas = 2
let pears = 55

let fruit = { apple, bannanas, pears }
// { apple: 7, bannanas: 2, pears: 55 }
```

### Operators

**equality (==, !=)**

Compares the values of the dictionaries, if all the keys and corresponding values are the same the dictionaries are equal.

```
{ apple: 7, bannanas: 2, pears: 55 } == { apple: 7, bannanas: 2, pears: 55 }
{ apple: 7, bannanas: 2, pears: 55 } != { apple: 7, bannanas: 2, }
{ apple: 7, bannanas: 2, pears: 55 } != { apple: 7, bannanas: 2, pears: '55' }
```

### Built-in Methods + Properties

**keys**

- a list containing all the keys in the dictionary

**values**

- a list containing all the values in the dictionary

**isImmutable**

- Boolean value stating if the dictionary is immutable or not

**freeze()**

- Makes the dictionary immutable
- Takes 0 parameters
- Returns the dictionary

**unfreeze()**

- Makes the dictionary mutable
- Takes 0 parameters
- Returns the dictionary

**get()**

- Get a value from an array
- Takes 1 parameter
- Returns the value if it exists else it returns null

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- Returns `true`

**toString()**

- Converts the value to a string
- Takes 0 parameters
- Returns the dictionary as a string, similar to JSON

## List

Represents a sequence of values. The values can take any type.
It is mutable by default.

```
// declare lists
[1, 2, 3]
[[1, 2], [3, 4], [5, 6]]
[
  'a',
  'series',
  'of',
  'strings',
]

// get items by index
[1, 2, 3][0]  // 1
[1, 2, 3][2]  // 3
[1, 2, 3][-1] // 3
[1, 2, 3][-2] // 2
[1, 2, 3][4]  // error

// if an list is immutable, values can be reassigned
let a = [1, 2, 3]
a[1] = 'hello'
a // [1, 'hello', 3]

// get a section of the list (returns a new copy of the section of the list)
[1,2,3,4,5,6,7,8][2:4] // [3,4]
[1,2,3,4,5,6,7,8][:3]  // [1,2,3]
[1,2,3,4,5,6,7,8][6:]  // [7,8]
```

### Operators

**equality (==, !=)**

Compares the values of the list, if all the values are the same the lists are equal.

```
[] == []
[1, 2, 3, 4] == [1,2,3,4]
[1, 2, 3] == [1, 1 + 1, 1 + 2]
[1, 2, 3, 4] != [1,2,3]
[1, 2, 3, 4] != []
```

**plus (+)**

If the value is a list it concatenates the 2 lists, else it adds the item to the end of the list.
It errors if the list is immutable.

```
[1, 2, 3] + 4   // [1, 2, 3, 4]
[1, 2] + [3, 4] // [1, 2, 3, 4]
```

### Built-in Methods + Properties

**length**

- A number representing the length of the list

**isImmutable**

- Boolean value stating if the list is immutable or not

**freeze()**

- Makes the list immutable
- Takes 0 parameters
- Returns the list

**unfreeze()**

- Makes the list mutable
- Takes 0 parameters
- Returns the list

**map(transform)**

- Transform a list, using the specified functions
- Takes 1 parameter, a function accepting up to 2 paramters, the first being the current element of the list and the seconds it's index
- Returns a new list, made of the list with each element being transformed by the

**filter(predicate)**

- Remove items from a list not matching the specified condition
- It removes all items which the predicate function when applied on the list item, is falsy
- Takes 1 parameter, a function accepting up to 2 paramters, the first being the current element of the list and the seconds it's index
- Returns a new list, with the falsy elements removed

**reduce(transform)**

- Transform a list into a single value
- Takes 2 parameters, a function accepting up to 3 paramters (the currentValue created (accumulator), the current value and the current index), and a startingValue
- Returns the value calculated from the list

**forEach(function)**

- Run a function over each element of the list
- Takes 1 parameter, a function accepting up to 2 paramters, the first being the current element of the list and the seconds it's index
- Returns `null`

**every()**

- Are all items truthy
- It takes 0 parameters
- Returns `true` if all elements are truthy, or `false` otherwise

**any()**

- Are any of the truthy
- It takes 0 parameters
- Returns `true` if any of the elements are truthy, or `false` otherwise

**reverse()**

- Reverses the list
- Takes 0 parameters
- Returns a new list, in the reverse order

**includes()**

- Check if a value is in the list
- Takes one parameter which is the value to check if it is in the list
- Return a boolean of if the value is in the list or not

**pop()**

- Removes the last element from the list
- It takes 0 parameters
- It returns the last element of the list, or null if the list is empty
- It errors if the list is immutable

**push(value)**

- Appends a value to the end of the list
- It takes 1 parameter, the value to add to the list
- Returns the list
- It errors if the list is immutable

**shift()**

- Removes the first element from the list
- It takes 0 parameters
- It returns the first element of the list, or null if the list is empty
- It errors if the list is immutable

**unshift(value)**

- Appends a value to the start of the list
- It takes 1 parameter, the value to add to the list
- Returns the list
- It errors if the list is immutable

**join(separator)**

- Join a string together
- It takes 1 parameter, the string to place between the list elements
- Returns a string of the string representation of all the values in the list separated by the separator string specified

**find(predicate)**

- Gets the first element matching the predicate function
- Takes 1 parameter, the predicate function for the comparison
- Returns the value matching, else `null`

**findIndex(predicate)**

- Gets the index of the first element for which the predicate function specified is truthy
- Takes 1 parameter, the predicate function for the comparison
- Returns the index of the element matching, else `null`

**indexOf(value)**

- Get the index of an item in a list
- Takes 1 parameter the value to look for in the list
- Returns the index if found else `null`

**copy()**

- Make a shallow copy of the list
- Takes 0 parameters
- Returns a new copy of the list

**min()**

- Get the minimum value of the list
- Expects to be called on a non-empty list made up up only of numbers
- Takes 0 parameters
- Returns the minimum value

**max()**

- Get the maximum value of the list
- Expects to be called on a non-empty list made up up only of numbers
- Takes 0 parameters
- Returns the maximum value

**sum()**

- Get the sum of the values in the list
- Expects the list to be made up up only of numbers
- Takes 0 parameters
- Returns the sum

**get(index)**

- Get a value at the index of an array
- It takes 1 number as a parameter, as the index
- Returns the value at the given index, or `null` if the index doesn't exist
- Supports negative indexing

**toString()**

- Returns a string representation of the list
- Takes 0 parameters
- Returns a string representation of the list

**toBoolean()**

- Converts the value to boolean
- Takes 0 parameters
- Returns `true`

# Variables

Variable can store values, they must be declared before they can be used. 2 variables cannot have the same name in the same scope, creating a block creates a new scope. A block is created by indenting by 2 spaces.

Variables are referenced through an identifier, an identifier starts with a letter or underscore and then has letters, number or underscores. It would match the regular expression `[_a-zA-Z][_a-zA-Z0-9]*`

The `const` keyword creates a variable which cannot be reassigned, composite structures like dictionaries and lists can be modified if they are immutable.
The `let` keyword creates a variable which cannot be reassigned.

Keywords that cannot be used as variable identifiers are: `and, or, if, else, while, null, true, false, let, const, return`

The identifier `_` is a placeholder, it always has the value of null, and does not need to be defined. It cannot take any other value, and if assigned to it will just be ignored.

```
// declare the variable and set it to the value of an expression
let identifier = <expression>
const identifier = <expression>

// sets the value to null if no expression is specified
let identifier
const identifier

let a = 5
a = a + 5
a // 10

let a = 7 // error - variable already exists

  let a = 7
  a // 7

a // 10

const b = 8
b = 4 // error variable is a constant
```

# Control Flow

Most expressions evaluate to a truthy value, the only falsy values in bang are `false` and `null`

## If/ Else Statements

Execute a branch conditionally if the expression evaluates to a truthy value.

```
if (<condition expresssion>) <do this if condition is truthy>

if (<condition expresssion>) <if condition truthy do this>
else <if falsy do this statement>

if (<condition expresssion>)
  <if condition truthy do this>
  <then this>
  <finish off with this>
  <this is only done if condition truthy>
else
  <if falsy do this statement>
  <then this>


// you can also chain then to make if/ else if/ else statements
if (<condition>) <do this>
else if (<next condition>) <do that>
else <otherwise do this>
```

## While Loops

Execute a body multiple times if the condition is truthy.

```
while (<condition expresssion>) <do this if condition is truthy>

while (<condition expresssion>)
  <if condition truthy do this>
  <then this>
  <finish off with this>
  <keep doing this>
```

# Global Built-in Functions

## print(value)

Takes one value and prints its value to the console.
Returns null.

## type(value)

Get the type of the value passed.
Returns a string representing the type of the value passed.

# Operators

## Equality

Objects are equal if they have the same value. Values have to have the same type to be equal

## Logical Operators

The `and` or `&&` returns the first falsy value or the 2nd value if they are both truthy.

The `or` or `||` returns the first truthy value or the 2nd value if they are both falsy.

```
true and 2       // 2
2 && true        // true
"hello" and 77   // 77
0 and 77         // 77
2 and "hello"    // 'hello'
"hello" && 77    // 77
0 && 77          // 77
2 && "hello"     // 'hello
((a) => a + 1) && "hello"  // 'hello'
{} && "hello"    // 'hello'
[] && "hello"    // 'hello'
false and false  // false
false and true   // false
false and 77     // false
null and "hello" // null
null && "hello"  // null
((a) => a + 1) || "hello" // '<function>'
{} || "hello"    // {}
false or false   // false
false or true    // true
false or 77      // 77
null or "hello"  // 'hello'
```

## Assignment Operators

The assignment operators (`+=`, `-=`, `*=`, `/=`) perform the operation to the assignment target, with the value afterwards before storing the target in the assignment target.

```
a += 1  // a = a + 1
b -= 2  // b = b - 2
c *= 4  // c = c * 4
d /= 22 // d = d / 22
```

# Comments

```
// a single line comment

`
a multiline string can also be used as comments
`
```
