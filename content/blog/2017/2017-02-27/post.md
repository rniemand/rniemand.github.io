---
title: Arduino Cheat Sheet
date: 2017-02-27
tags: [arduino]
logo: arduino.png
---
The majority of content found on this cheat sheet comes from the [official Arduino documentation](https://www.arduino.cc/), if you find that something is lacking please comment and I will update this post accordingly.

## Including Files
```cpp
#include <Adafruit_GFX.h>
```

Using `#include <...>` the compiler searches in an implementation dependent manner, normally in search directories pre-designated by the compiler/IDE

```cpp
#include "joystick.h"
```

Using `#include "..."` the compiler searches in the same directory as the file containing the directive.

## Data Types
Below is a complete list of all **data types** available when programming on the Arduino platform. I will try to keep this section up to date as I learn more.

| Type | Example | Storage | Range |
| --- | --- | --- | --- |
| `void` | `void setup() { ... }` | - | - |
| `boolean` | `true` | 1 byte (8 bit) | true | false |
| `char` | `'A'` | 1 byte (8 bit) | - |
| `byte` | `128` | 1 byte (8-bit) | 0 to 255 |
| `int` | `64` | 2 byte (16 bit) | -2,147,483,648 to 2,147,483,647 |
| `word` | `10000` | -- | 2|4 byte (16|32-bit) |
| `long` | `186000L` | 4 bytes (32 bits) | 2,147,483,648 to 2,147,483,647 |
| `short` | `13` | 2 bytes (16 bits) | -32,768 to 32,767 |
| `float` | - | 4 bytes (32 bits) | -3.4028235E+38 to 3.4028235E+38 |
| `double` | `1.117` | 8 bytes (64 bits)* | ... |
| `string char[]` | `"arduino"` | varies | varies |
| `String` | `"arduino"` | varies | varies |
| `array` | `vals[0] == 2` | varies | varies |

## Core Methods
Some useful methods / functions for writing your applications.

### delay()
Pauses the program for the amount of time (in milliseconds) specified as parameter. (There are 1000 milliseconds in a second.)

```cpp
delay(1000)
```

### Working with IO
Useful methods when working with Arduino pins.

```cpp
// Sets the pin as input (using internal pullup resistor)
pinMode(JOY_BTN, INPUT_PULLUP);

// Sets the pin as an input
pinMode(JOY_X, INPUT);

// Reads data from an analog pin (0-1024)
int aData = analogRead(pinX);

// Reads data from a digital pin (0-1)
int dData = digitalRead(pinBtn);
```

- **Digital** - used to read high or low (`1` or `0`)
- **Analog** - used to read a value between `0` and `1024`

Working with Serial.

```cpp
// Start serial @ 9600 bps
Serial.begin(9600);

// Append given value to current line
Serial.print("...");

// Append given value to line and insert a line break
Serial.println("...");
```

### Comments
```
// (single line comment)
/* */ (multi-line comment)
```

### Constants
```
HIGH | LOW
INPUT | OUTPUT | INPUT_PULLUP
LED_BUILTIN
true | false
```

### Time
- millis()
- micros()
- delay()
- delayMicroseconds()

### Math
- min()
- max()
- abs()
- constrain()
- map()
- pow()
- sqrt()
- sin()
- cos()
- tan()

### Characters
- isAlphaNumeric()
- isAlpha()
- isAscii()
- isWhitespace()
- isControl()
- isDigit()
- isGraph()
- isLowerCase()
- isPrintable()
- isPunct()
- isSpace()
- isUpperCase()
- isHexadecimalDigit()

### Random Numbers
- randomSeed()
- random()

### Bits and Bytes
- lowByte()
- highByte()
- bitRead()
- bitWrite()
- bitSet()
- bitClear()
- bit()

### Interrupts
- attachInterrupt() - External
- detachInterrupt() - External
- interrupts()
- noInterrupts()
