---
title: Find the nth occurrence of a string (JavaScript)
date: 2016-03-23
# categories: [code]
# tags: [javascript]
# toc: true
---
I was playing around in JavScript needing to find 7’th position of a `(` within a long string. Messing about with the [indexOf](https://www.w3schools.com/jsref/jsref_indexof.asp) and [substring](https://www.w3schools.com/jsref/jsref_substring.asp) methods were a bit too cumbersome so I came up with the following code snippet. Hopefully this saves you some time.

```js
function nthOccurrence(str, s, c) {
    var strlen = str.length;
    var matches = 0;

    for(i = 0; i < strlen; i++){
        if(str[i] === s) matches++;
        if(matches == c) return i;
    }
}
```
