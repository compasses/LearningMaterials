#!/usr/bin/env node

"use strict"

// switch (prompt("What is the weather like?")) {
//   case "rainy":
//     console.log("Remember to bring an umbrella.");
//     break;
//   case "sunny":
//     console.log("Dress lightly.");
//   case "cloudy":
//     console.log("Go outside.");
//     break;
//   default:
//     console.log("Unknown weather type!");
//     break;
// }

var x = "outside";

var f1 = function() {
  var x = "inside f1";
};
f1();
console.log(x);
// → outside

var f2 = function() {
  x = "inside f2";
};
f2();
console.log(x);
// → inside f2


var landscape = function() {
  var result = "";
  var flat = function(size) {
    for (var count = 0; count < size; count++)
      result += "_";
  };
  var mountain = function(size) {
    result += "/";
    for (var count = 0; count < size; count++)
      result += "'";
    result += "\\";
  };

  flat(3);
  mountain(4);
  flat(6);
  mountain(1);
  flat(1);
  return result;
};

console.log(landscape());
// → ___/''''\______/'\_

function power(base, exponent) {
  if (exponent == 0)
    return 1;
  else
    return base * power(base, exponent - 1);
}

console.log(power(2, 10000));

function findSolution(target) {
  function find(start, history) {
    if (start == target)
      return history;
    else if (start > target)
      return null;
    else
      return find(start + 5, "(" + history + " + 5)") ||
             find(start * 3, "(" + history + " * 3)");
  }
  return find(1, "1");
}

console.log(findSolution(124));


function zeroPad(number, width) {
  var string = String(number);
  while (string.length < width)
    string = "0" + string;
  return string;
}

function printFarmInventory(cows, chickens, pigs) {
  console.log(zeroPad(cows, 3) + " Cows");
  console.log(zeroPad(chickens, 3) + " Chickens");
  console.log(zeroPad(pigs, 3) + " Pigs");
}

printFarmInventory(7, 16, 3);

var todoList = [];
function rememberTo(task) {
  todoList.push(task);
}
function whatIsNext() {
  return todoList.shift();
}
function urgentlyRememberTo(task) {
  todoList.unshift(task);
}

rememberTo('first');
rememberTo('seconde');

console.log(whatIsNext() === 'first' && todoList.length === 1);
urgentlyRememberTo('urgent');
console.log(whatIsNext() === 'urgent' && todoList.length === 1);

console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3

function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]

function randomPointOnCircle(radius) {
  console.log(Math);
  var angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}

// Your code here.
function reverseArray(arr) {
  var newA = [];
  for (var i = arr.length - 1; i >= 0; --i) {
    newA.push(arr[i]);
  }

  return newA;
}

function reverseArrayInPlace(arr) {
  var len = arr.length-1;
  var end = 0;
  while (len > end) {
    var t = arr[len];
    arr[len] = arr[end];
    arr[end] = t;
    len--;
    end++;
  }
}


console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]

// Your code here.
function arrayToList(arr) {
  if (arr.length === 0) {
    return null;
  } else {
    return {
      value: arr[0],
      rest: arrayToList(arr.slice(1))
    };
  }
}

function listToArray(list) {
  var res = [];
  if (list === null) {
    return res;
  }
  do {
    res.push(list.value);
    list = list.rest;
  }while (list !== null);
  
  return res;
}

function prepend(val, list) {
  return {
    value: val,
    rest: list
  };
}

// function nth(list, nth) {
//   for (var i = 0; list !== null; i++) {
//     if (i === nth) {
//       return list.value;
//     } else {
//       list = list.rest;
//     }
//   }

//   return undefined;
// }

function nth(list, num) {
  if (list === null) {
    return undefined;
  }
  if (num === 0) {
    return list.value;
  }

  return nth(list.rest, --num);
}

console.log(arrayToList([10, 20, 30]));
// → {value: 10, rest: {value: 20, rest: null}}
 console.log(listToArray(arrayToList([10, 20, 30])));
// // → [10, 20, 30]
 console.log(prepend(10, prepend(20, null)));
// // → {value: 10, rest: {value: 20, rest: null}}
 console.log(nth(arrayToList([10, 20, 30]), 2));
// → 20

// Your code here.

function deepEqual(obj1, obj2) {
  //console.log(typeof obj1);
  if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === typeof obj1) {
    for (var prop in obj1) {
      if (deepEqual(obj1[prop], obj2[prop]) === false) {
        return false;
      }
    }
    return true;
  } else if (typeof obj1 !== typeof obj2 ) {
    return false;
  } else {
    return obj1 === obj2;
  }
}


var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "ana"}, object: 2}));
// → false
console.log(deepEqual([1,2,3], [1,2,4]));



