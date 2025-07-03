---
title: Arduino Data Type Usage Examples
date: 2017-02-28
# categories: [cheat sheets]
# tags: [arduino]
# toc: true
---
This is a quick reference page based on the [Official Arduino Reference Guide](https://www.arduino.cc/) aimed at giving useful data type usage examples.

## void
The void keyword is used only in function declarations. It indicates that the function is expected to return no information to the function from which it was called.

```cpp
void setup() {}
void loop() {}
```

## boolean
A boolean holds one of two values, true or false. (Each boolean variable occupies one byte of memory.)

```cpp
boolean running = false;
```

## char
A data type that takes up 1 byte of memory that stores a character value. Character literals are written in single quotes, like this: 'A' (for multiple characters - strings - use double quotes: "ABC").

```cpp
char myChar = 'A';
char myChar = 65;  // both are equivalent
```

## byte
A byte stores an 8-bit unsigned number, from 0 to 255.
byte b = B10010;  // "B" is the binary formatter (B10010 = 18 decimal)


## int
Integers are your primary data-type for number storage.

On the Arduino Uno (and other ATMega based boards) an int stores a 16-bit (2-byte) value. This yields a range of -32,768 to 32,767 (minimum value of -2^15 and a maximum value of (2^15) - 1). 

On the Arduino Due and SAMD based boards (like MKR1000 and Zero), an int stores a 32-bit (4-byte) value. This yields a range of -2,147,483,648 to 2,147,483,647 (minimum value of -2^31 and a maximum value of (2^31) - 1).

```cpp
int ledPin = 13;
```

## word
On the Uno and other ATMEGA based boards, a word stores a 16-bit unsigned number. On the Due and Zero instead it stores a 32-bit unsigned number.

```cpp
word w = 10000; 
```

## long
Long variables are extended size variables for number storage, and store 32 bits (4 bytes), from -2,147,483,648 to 2,147,483,647.

If doing math with integers, at least one of the numbers must be followed by an L, forcing it to be a long. See the Integer Constants page for details.

```cpp
long speedOfLight = 186000L;
```

## short
A short is a 16-bit data-type.
On all Arduinos (ATMega and ARM based) a short stores a 16-bit (2-byte) value. This yields a range of -32,768 to 32,767 (minimum value of -2^15 and a maximum value of (2^15) - 1).
short ledPin = 13;

## float
Datatype for floating-point numbers, a number that has a decimal point. Floating-point numbers are often used to approximate analog and continuous values because they have greater resolution than integers. Floating-point numbers can be as large as 3.4028235E+38 and as low as -3.4028235E+38. They are stored as 32 bits (4 bytes) of information.

Floats have only 6-7 decimal digits of precision. That means the total number of digits, not the number to the right of the decimal point. Unlike other platforms, where you can get more precision by using a double (e.g. up to 15 digits), on the Arduino, double is the same size as float.

Floating point numbers are not exact, and may yield strange results when compared. For example 6.0 / 3.0 may not equal 2.0. You should instead check that the absolute value of the difference between the numbers is less than some small number.

Floating point math is also much slower than integer math in performing calculations, so should be avoided if, for example, a loop has to run at top speed for a critical timing function. Programmers often go to some lengths to convert floating point calculations to integer math to increase speed.

If doing math with floats, you need to add a decimal point, otherwise it will be treated as an int. See the Floating point constants page for details.

```cpp
float myfloat;
float sensorCalbrate = 1.117;
```

## double
Double precision floating point number. On the Uno and other ATMEGA based boards, this occupies 4 bytes. That is, the double implementation is exactly the same as the float, with no gain in precision.

On the Arduino Due, doubles have 8-byte (64 bit) precision.

```cpp
double myValue = 100;
```

## string - char array
Text strings can be represented in two ways. you can use the String data type, which is part of the core as of version 0019, or you can make a string out of an array of type char and null-terminate it. This page described the latter method. For more details on the String object, which gives you more functionality at the cost of more memory, see the String object page.

```cpp
char Str1[15];
char Str2[8] = {'a', 'r', 'd', 'u', 'i', 'n', 'o'};
char Str3[8] = {'a', 'r', 'd', 'u', 'i', 'n', 'o', '\0'};
char Str4[ ] = "arduino";
char Str5[8] = "arduino";
char Str6[15] = "arduino";
```

## String
The String class, part of the core as of version 0019, allows you to use and manipulate strings of text in more complex ways than character arrays do. You can concatenate Strings, append to them, search for and replace substrings, and more. It takes more memory than a simple character array, but it is also more useful. 

For reference, character arrays are referred to as strings with a small s, and instances of the String class are referred to as Strings with a capital S. Note that constant strings, specified in "double quotes" are treated as char arrays, not instances of the String class.

## array
An array is a collection of variables that are accessed with an index number. Arrays in the C programming language, on which Arduino is based, can be complicated, but using simple arrays is relatively straightforward.

Creating (Declaring) an Array

All of the methods below are valid ways to create (declare) an array.

```cpp
int myInts[6];
int myPins[] = {2, 4, 8, 3, 6};
int mySensVals[6] = {2, 4, -8, 3, 2};
char message[6] = "hello";
```

You can declare an array without initialising it as in myInts.

In myPins we declare an array without explicitly choosing a size. The compiler counts the elements and creates an array of the appropriate size.

Finally you can both initialise and size your array, as in mySensVals. Note that when declaring an array of type char, one more element than your initialization is required, to hold the required null character.

Accessing an Array

Arrays are zero indexed, that is, referring to the array initialization above, the first element of the array is at index 0, hence

```cpp
mySensVals[0] == 2, mySensVals[1] == 4, and so forth.
```

It also means that in an array with ten elements, index nine is the last element. Hence:

```cpp
int myArray[10]={9,3,2,4,3,2,7,8,9,11};
// myArray[9]    contains 11
// myArray[10]   is invalid and contains random information (other memory address)      
```

For this reason you should be careful in accessing arrays. Accessing past the end of an array (using an index number greater than your declared array size - 1) is reading from memory that is in use for other purposes. Reading from these locations is probably not going to do much except yield invalid data. Writing to random memory locations is definitely a bad idea and can often lead to unhappy results such as crashes or program malfunction. This can also be a difficult bug to track down.

Unlike BASIC or JAVA, the C compiler does not check to see if array access is within legal bounds of the array size that you have declared.

To assign a value to an array:

```cpp
mySensVals[0] = 10;
```

To retrieve a value from an array:

```cpp
x = mySensVals[4];
```

### Arrays and FOR Loops
Arrays are often manipulated inside for loops, where the loop counter is used as the index for each array element. For example, to print the elements of an array over the serial port, you could do something like this:

```cpp
int i;
for (i = 0; i < 5; i = i + 1) {
  Serial.println(myPins[i]);
}
```
