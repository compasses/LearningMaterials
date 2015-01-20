'use strict';

// var a = "hello";
// println(a);

// var extend = function (subClass, baseClass) {
// 	subClass.baseConstructor = baseClass;
// 	subClass.base= {};
// 	baseClass.call(subClass.base);
// }

// function Mouse() {

// }

// function Animal(name) {
// 	this.name = name;
// 	this.say = function (message) {
// 		println(this.name + ": " + message);
// 	}
// 	this.eat = function() {
// 		this.say("Yum!");
// 	}

// 	this.respire = function() {
// 		println(this.name + ": respire" );
// 	}
// }

// function Cat(name) {
// 	if (name) {
// 		Cat.baseConstructor.call(this, name);
// 	} else {
// 		Cat.baseConstructor.call(this, 'cat');
// 	}

// 	this.eat = function(food) {
// 		if (food instanceof Mouse) {
// 			Cat.base.eat.call(this);
// 		} else {
// 			this.say("Yuk, I only eat mice - not " + food.name);
// 		}
// 	}
// }

// extend(Cat, Animal);

// function Lion() {
// 	Lion.baseConstructor.call(this, 'lion');
// }

// extend(Lion, Cat);

// var cat = new Cat();
// var lion = new Lion();
// var mouse = new Mouse();

// var unknowObj = {};

// cat.eat(mouse);
// cat.eat(unknowObj);

// lion.eat(mouse);


// var obj1 = new Animal();
// var obj2 = new Animal();


// println(obj1.respire == obj2.respire);

// void function (i) {
// 	println(i);
// 	(--i > 0) && arguments.callee(i);
// }(100);

// function myFunc() {
// 	function func() {
// 	}

// 	this.doFunc  = func;
// }

// var obj = new Object();

// myFunc.call(obj);

// var func = obj.doFunc;
// myFunc.call(obj);

// println(func == obj.doFunc);

// println(func.toString() == obj.doFunc.toString());





// //alert(a);
// //console.log(a);

function MyObject() {
	var instance_data = 100;

	this.getInstanceData = function() {
		return instance_data;
	}

	this.setInstanceData = function(v) {
		instance_data = v;
	}
}

void function () {
	var class_data = 5;
	this.getClassData = function() {
		return class_data;
	}
	this.setClassData = function(v) {
		class_data = v;
	}
}.call(MyObject.prototype);

var obj1 = new MyObject();
var obj2 = new MyObject();

obj1.setInstanceData(210);

println(obj2.getInstanceData());

obj1.setClassData(2220);

println(obj2.getClassData());


function Counter(start) {
    var count = start;
    return {
        increment: function() {
            count++;
        },

        get: function() {
            return count;
        }
    }
}

var foo = Counter(4);
var foo2 = Counter(5);
foo.increment();
println(foo.get()); // 5

println(foo.increment == foo2.increment);

println(Math.floor(1.2332));
println("seven".length);

function mutable(a) {
	a = 100;
	return a;
}

var aa = 200;

aa = mutable(aa);

println(aa);
// for(var i = 0; i < 10; i++) {
//     (function(e) {
//         setTimeout(function() {
//             println(i);  
//         }, 1000);
//     })(i);
// }


var obString = function (obj) {
	var rest = "";
	for (var mvar in obj) {
		if (typeof obj[mvar] == 'object') {
			rest += mvar + ": { "
			rest += obString(obj[mvar]);
			rest += "}, "
		}
		else if (obj.hasOwnProperty(mvar)) {
			rest += mvar + ": " + obj[mvar] + ", ";
		} else {
			rest += mvar + ":---- " + obj[mvar] + ", ";
		}
	}
	return rest;
}

var flight = {
	airline: "Oceanic",
	number: 815,
	departure:{
		IATA:"SYD",
		time:"2002",
		city:"sydney"
	},
	arrival:{
		IATA:"LAX",
		time:"2003",
		city:"Los Angels"
	}
};

println(obString(flight));
println(obString(obj1));

println(flight.prototype === Object.prototype);

if  (typeof Object.create !== 'function') {
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	}
}

var st1 = Object.create(new Object);
st1.firstname = "okokok";

var st2 = Object.create(st1);
st2.firstname = "huhuhuhu";
delete st2.firstname;
println(st2.firstname);

//the method invocation pattern
var myObject = {
	value: 0,
	increment: function (inc) {
		this.value += typeof inc == 'number' ? inc:1;
	}
}

myObject.increment();

myObject.increment(2);

//the function invocation pattern

myObject.double2 = function () {
	var that = this;

	var helper = function() {
		that.value += that.value;
	}
	helper();
}

myObject.double2();
println(myObject.value);

//constructor invocation pattern
var Quo = function(string) {
	this.status = string;
}

Quo.prototype.get_status = function() {
	return this.status;
}

var myQuo = new Quo("confused");
println(myQuo.get_status());

var add = function (a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') {
		throw {
		name: 'TypeError',
		message: 'add needs numbers'
		};
	}
	return a + b;
}

//the apply invocation pattern
// Make an array of 2 numbers and add them.
var array = [3, 4];
var sum = add.apply(null, array); // sum is 7
// Make an object with a status member.
var statusObject = {
status: 'A-OK'
};
// statusObject does not inherit from Quo.prototype,
// but we can invoke the get_status method on
// statusObject even though statusObject does not have
// a get_status method.
var status = Quo.prototype.get_status.apply(statusObject);
// status is 'A-OK'
println(status);


// Make a try_it function that calls the new add
// function incorrectly.
var try_it = function ( ) {
	try {
		add("seven");
	} catch (e) {
		println(e.name + ': ' + e.message);
	}
}

try_it( );

Function.prototype.method = function(name, func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
	}
}

String.method('trim', function () {
	return this.replace(/^\s+|\s+$/g, '');
});

println('"' + " neat ".trim( ) + '"');

var myObject = function () {
	var value = 0;

	return {
		increment: function (inc) {
			value += typeof inc === 'number' ? inc : 1;
		},
		getValue: function() {
			return value;
		}
	};
}();

myObject.increment(2);
println(myObject.getValue());
println(myObject.value);

// Create a maker function called quo, It makes an object with a get_status method and private status property

var quo = function (status) {
	return {
		get_status: function () {
			return status;
		}
 	};
}

var myQuo = quo('amazed');

println(myQuo.get_status());

// BAD EXAMPLE
// Make a function that assigns event handler functions to an array of nodes the wrong way.
// When you click on a node, an alert box is supposed to display the ordinal of the node.
// But it always displays the number of nodes instead.
var add_the_handlers = function (nodes) {
var i;
	for (i = 0; i < nodes.length; i += 1) {
		nodes[i].onclick = function (e) {
			println(i);
		};
	}
};

add_the_handlers([1,2,3,4]);

// BETTER EXAMPLE
// Make a function that assigns event handler functions to an array of nodes the right way.
// When you click on a node, an alert box will display the ordinal of the node.
var add_the_handlers = function (nodes) {
	var i;
	for (i = 0; i < nodes.length; i += 1) {
		nodes[i].onclick = function (i) {
			return function (e) {
			alert(e);
			};
		}(i);
	}
};

//callbacks make an asynchronously

// Module

String.method('deentityify', function() {
	//The entity table. It maps entity names to characters
	var entity = {
		quot: '"',
		lt:'<',
		gt:'>'
	};

	return function () {
		// this is the deentityify method, it calls the string replace method, looking for substrings that start
		// with '&' and end with ';'. if the characters in between are in the entity table, the replace the entity
		//with the characters from the table. it uses a regular expression
		return this.replace(/&([^&;]+);/g,
				function (a, b) {
					var r = entity[b];
					return typeof r === 'string' ? r : a;
				});
	};
}());

println('&lt;&quot;&gt;'.deentityify());

//Memoization

var fibonacci = function () {
	var memo = [0, 1];
	var fib = function (n) {
		var result = memo[n];
		if (typeof result !== 'number') {
			result = fib(n-1) + fib(n-2);
			memo[n] = result;
		} 
		return result;
	};
	return fib;
}();

for (var i = 0; i <= 10; ++ i) {
	println(fibonacci(i));
}

