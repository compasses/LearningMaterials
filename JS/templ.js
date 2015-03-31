var http = require("http");
var url  = require("url");

function onRequest(request, response) {
	var postData = "";
	var pathname =  url.parse(request.url).pathname;

	console.log("request for" + pathname + "received");
	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
		console.log("Received POST data chunk '" + postDataChunk + "'");

	});

	request.addListener("end", function() {
		procRequest(pathname, response, postData);			
	});
}


var TemplateEngine = function(html, options) {
    // magic here ...
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

var template = '<p>Hello, my name is <%this.name%>. I\'m <%this.age%> years old.</p>';
	var data = {
	    name: "Krasimir",
	    age: 29
	};
	var body = TemplateEngine(template, data);
	console.log(body);

function procRequest(pathname, response, postData){
	var data = {
	    name: "Krasimir",
	    age: 29
	};
	var body = TemplateEngine(template, data);
	console.log(body);

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

http.createServer(onRequest).listen(8888);
console.log('server has started')

