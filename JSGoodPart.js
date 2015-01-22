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

/*
We can generalize this by making a function that helps us make memoized functions.
The memoizer function will take an initial memo array and the fundamental function.
It returns a shell function that manages the memo store and that calls the
fundamental function as needed. We pass the shell function and the function’s
parameters to the fundamental function:
*/
var memoizer = function (memo, fundamental) {
	var shell = function (n) {
		var result = memo[n];
		if (typeof result !== 'number') {
			result = fundamental(shell, n);
			memo[n] = result;
		}
		return result;
	};
	return shell;
};

var fibonacci2 = memoizer([0, 1], function(shell, n){
	return shell(n-1) + shell(n-2);
});

var factorial = memoizer([1, 1], function (shell, n) {
return n * shell(n - 1);
});

for (var i = 0; i <= 10; ++ i) {
	println(fibonacci2(i));
}

var serial_maker = function () {
	var prefix = "";
	var seq = 0;
	return {
		set_prefix: function (p) {
			prefix = String(p);
		},
		set_seq: function (s) {
			seq = s;
		},
		gensym : function () {
			var result = prefix + seq;
			seq += 1;
			return result;
		}
	};
};

var seqer = serial_maker();

println(seqer);

seqer.set_prefix('Q');
seqer.set_seq(1000);
println(seqer.gensym());

/*

	var constructor = function (spec, my) {
		var that, other private instance variables;
		my = my || {};
		Add shared variables and functions to my
		that = a new object;
		Add privileged methods to that
		return that;
	};
*/

var mammal = function (spec) {
	var that = {};

	that.get_name = function () {
		return spec.name;
	};

	that.says = function () {
		return spec.saying || '';
	};

	return that;
}
var myMammal = mammal({name: 'Herb'});
println(myMammal.get_name());

var cat = function (spec) {
	spec.saying = spec.saying || 'meow';

	var that = mammal(spec);
	that.purr  = function (n) {
		var i, s='';
		for (i = 0; i < n; ++i) {
			if (s) {
				s+= '-';
			}
			s += 'r';
		}
		return s;
	}
	that.get_name = function () {
		return that.says() + ' ' + spec.name + ' ' + that.says();
	}

	return that;
}

var myCat = cat({name:'Henrietta'});

println(myCat.get_name());
println(myCat.purr(10));

Object.method('superior', function (name) {
	var that = this,
		method = that[name];
	return function () {
		return method.apply(that, arguments);
	}
});



var eventuality = function (that) {
	var registry = {};

	that.fire = function (event) {
		// Fire an event on an object, the event can be either a string containing the name of the event
		//or an object containing a type property containing the name of the event. Handlers registered by the 
		// 'on' method that match the event name will be invoked.
		var array,
			func,
			handler,
			i,
			type = typeof event === 'string' ? event : event.type;

		// If an array of handlers exist for this event, then loop through it and execute the handlers in order
		if (registry.hasOwnProperty(type)) {
			array = registry[type];
			for (i = 0; i < array.length; i += 1) {
				handler = array[i];
				//A handler record contains a method and an optional array of parameters. If the method is a name
				// look up the function
				func = handler.method;
				if (typeof func === 'string') {
					func = this[func];
				}
				//invoke a handler. If the record contained parameters, then pass them. Otherwise, pass the event objec
				func.apply(this, handler.parameters || [event]);
			}
		}
		return this;
	};
	that.on = function (type, method, parameters) {
		//register an event, make a handler record. put it in a handler array, making one if doesn't yet exist for this type
		var handler = {
			method: method,
			parameters: parameters
		};
		if (registry.hasOwnProperty(type)) {
			registry[type].push(handler);
		} else {
			registry[type] = [handler];
		}
		return this;
	};

	return that;
}

var coolcat = function (spec) {
	var that = cat(spec),
		super_get_name = that.superior('get_name');
	that.get_name = function(n) {
		return 'like ' + super_get_name() + ' baby';
	};
	eventuality(that);
	return that;
}

var myCoolCat = coolcat({name: 'bix'});

println(myCoolCat.get_name());

var is_array = function (value) {
	return value &&
	typeof value === 'object' &&
	typeof value.length === 'number' &&
	typeof value.splice === 'function' &&
	!(value.propertyIsEnumerable('length'));
};

Array.method('reduce', function (f, value) {
	var i;
	for (i = 0; i < this.length; i += 1) {
		value = f(this[i], value);
	}
	return value;
});

// Create an array of numbers.
var data = [4, 8, 15, 16, 23, 42];
// Define two simple functions. One will add two
// numbers. The other will multiply two numbers.
var add = function (a, b) {
	return a + b;
};
var mult = function (a, b) {
	return a * b;
};

// Invoke the data's reduce method, passing in the
// add function.
var sum = data.reduce(add, 0); // sum is 108
println(sum);
// Invoke the reduce method again, this time passing
// in the multiply function.
var product = data.reduce(mult, 1);
// product is 7418880
println(product);

// Give the data array a total function.
data.total = function ( ) {
	return this.reduce(add, 0);
};

var total = data.total( ); // total is 108

Array.dim = function (dimension, initial) {
	var a = [], i;
	for (i = 0; i < dimension; i += 1) {
		a[i] = initial;
	}
	return a;
};

Array.matrix = function (m, n, initial) {
	var a, i, j, mat = [];
	for (i = 0; i < m; i += 1) {
		a = [];
		for (j = 0; j < n; j += 1) {
			a[j] = initial;
		}
		mat[i] = a;
	}
	return mat;
};
// Make a 4 * 4 matrix filled with zeros.
var myMatrix = Array.matrix(4, 4, 0);
println(myMatrix[3][3]); // 0
// Method to make an identity matrix.
Array.identity = function (n) {
	var i, mat = Array.matrix(n, n, 0);
	for (i = 0; i < n; i += 1) {
		mat[i][i] = 1;
	}
	return mat;
};
myMatrix = Array.identity(4);
println(myMatrix[3][3]); // 1

var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = "http://www.ora.com:80/goodparts?q#fragment";

var result = parse_url.exec(url);
var names = ['url', 'scheme', 'slash', 'host', 'port',
'path', 'query', 'hash'];
var blanks = ' ';
var i;
println(result);
for (i = 0; i < names.length; i += 1) {
	println(names[i] + ':' + blanks.substring(names[i].length), result[i]);
}







